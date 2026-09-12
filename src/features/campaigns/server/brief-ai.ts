import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { buildTemplateDraft, DEFAULT_AVOID, DEFAULT_DO, DEFAULT_TONE } from "@/lib/brief-template";
import { BRIEF_AI_MAX_TOKENS, BRIEF_AI_MODEL, BRIEF_AI_TIMEOUT_MS, GEOGRAPHIES, INDUSTRIES } from "../constants";
import { z } from "zod";
import { type BrandProfile, type CampaignDraft, campaignDraftSchema } from "../schemas";

// The wire schema for the model: the shared campaignDraftSchema has zod
// transforms, which JSON Schema cannot express. The response is validated
// against the shared schema afterwards, so the shared one stays the truth.
const aiOutputSchema = z.object({
  name: z.string(),
  description: z.string(),
  brief: z.object({
    whatToTell: z.string(),
    targetIndustries: z.array(z.string()),
    targetGeos: z.array(z.string()),
    tone: z.string(),
    do: z.array(z.string()),
    avoid: z.array(z.string()),
    links: z.array(z.string()),
    angles: z.array(z.object({ angle: z.string(), hook: z.string(), direction: z.string(), example: z.string() })),
  }),
});

export type GeneratedDraft = { draft: CampaignDraft; generatedWith: "ai" | "template" };

export type GenerateInput = { brand: BrandProfile; prompt: string | null };

const SYSTEM_PROMPT = `You write creator briefs for naano, a B2B LinkedIn creator marketplace. A brand gives you its confirmed profile and a campaign goal; you return a campaign name, a one-line description and a brief that creators will post from.

Rules:
- Use only the confirmed information about the company. Never invent customers, results, figures or features.
- "whatToTell" is written to the creators, 3 to 5 sentences: what the company is (from the value proposition), who the audience is, and that they should introduce the product through their own expertise while keeping every claim grounded in the confirmed profile.
- Pick targetIndustries only from this list: ${INDUSTRIES.join(" · ")}. Pick targetGeos only from: ${GEOGRAPHIES.join(" · ")}.
- tone is exactly: "${DEFAULT_TONE}"
- do is exactly these three lines with the company name filled in: ${DEFAULT_DO.map((l) => `"${l}"`).join(", ")}
- avoid is exactly: ${DEFAULT_AVOID.map((l) => `"${l}"`).join(", ")}
- links: the company website if known, otherwise empty.
- angles: exactly 3, each with a short angle title, a one-line hook, an editorial direction (2–3 sentences) and a post example (3–5 sentences in a creator's own voice, disclosing the partnership).
- The campaign name is short (under 8 words). The description is one sentence.`;

function userPrompt({ brand, prompt }: GenerateInput) {
  const icps = brand.icps.map((icp, i) => `ICP ${i + 1} — ${icp.title}: ${icp.description}`).join("\n");
  return [
    `Company: ${brand.company}`,
    brand.website ? `Website: ${brand.website}` : null,
    `Value proposition: ${brand.valueProp ?? "(not written yet — say so and stay generic)"}`,
    icps ? `Ideal customers:\n${icps}` : "Ideal customers: (none written yet)",
    `Target industries (workspace settings): ${brand.targetIndustries.join(", ") || "(none)"}`,
    `Target regions: ${brand.targetRegions.join(", ") || "(none)"}`,
    prompt ? `Campaign goal from the brand: ${prompt}` : "Campaign goal: a first creator brief introducing the company.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function generateWithAi(input: GenerateInput): Promise<CampaignDraft | null> {
  const client = new Anthropic({ timeout: BRIEF_AI_TIMEOUT_MS, maxRetries: 1 });
  const response = await client.messages.parse({
    model: BRIEF_AI_MODEL,
    max_tokens: BRIEF_AI_MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt(input) }],
    output_config: { format: zodOutputFormat(aiOutputSchema) },
  });
  if (response.stop_reason === "refusal" || !response.parsed_output) return null;
  // The shared schema applies the limits and the transforms the wire schema lacks.
  const parsed = campaignDraftSchema.safeParse(response.parsed_output);
  return parsed.success ? parsed.data : null;
}

function templateDraft(input: GenerateInput): CampaignDraft {
  const { brand, prompt } = input;
  return campaignDraftSchema.parse(
    buildTemplateDraft({
      company: brand.company,
      valueProp: brand.valueProp,
      icps: brand.icps,
      targetIndustries: brand.targetIndustries,
      targetRegions: brand.targetRegions,
      website: brand.website,
      prompt,
    }),
  );
}

// AI when ANTHROPIC_API_KEY is set; the template on any failure (missing key,
// network, refusal, invalid JSON). The deploy never fails because of the key.
export async function generateCampaignDraft(input: GenerateInput): Promise<GeneratedDraft> {
  if (!process.env.ANTHROPIC_API_KEY) return { draft: templateDraft(input), generatedWith: "template" };
  try {
    const draft = await generateWithAi(input);
    if (draft) return { draft, generatedWith: "ai" };
    console.warn("[campaigns] brief-ai returned no usable draft, using the template", { brandId: input.brand.id });
  } catch (error) {
    const reason = error instanceof Anthropic.APIError ? `${error.name} ${error.status ?? ""}`.trim() : "unexpected error";
    console.error("[campaigns] brief-ai failed, using the template", { brandId: input.brand.id, reason, error });
  }
  return { draft: templateDraft(input), generatedWith: "template" };
}
