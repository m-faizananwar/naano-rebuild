import type { Brief, BrandIcp } from "@/db/schema";
import { daysAgo, daysFromNow, hex } from "./random";

export const DEFAULT_DO = [
  "Use only the confirmed information about {Company}.",
  "Connect the product to a practical audience question.",
  "Disclose the sponsored partnership clearly.",
];
export const DEFAULT_AVOID = [
  "Do not invent customers, results, figures or features.",
  "Do not force an endorsement or promise outcomes.",
];
const DEFAULT_TONE = "Clear, useful and natural. Keep the creator's own voice rather than following a script.";

export type CampaignFixture = {
  key: string;
  name: string;
  description: string;
  status: "draft" | "active" | "completed";
  openToApplications: boolean;
  postDeadline: Date | null;
  defaultFeeCents: number;
  brief: Brief;
  createdAt: Date;
};

export type BrandFixture = {
  key: "zune" | "premium-inboxes" | "orbisearch";
  slug: string;
  company: string;
  website: string;
  valueProp: string;
  icps: BrandIcp[];
  targetIndustries: string[];
  targetRegions: string[];
  pixelSiteKey: string;
  owner: { firstName: string; lastName: string; email: string };
  topupCents: number;
  campaigns: CampaignFixture[];
};

function brief(company: string, partial: Partial<Brief> & Pick<Brief, "whatToTell" | "angles">): Brief {
  return {
    targetIndustries: ["B2B", "SaaS"],
    targetGeos: ["Europe", "North America"],
    tone: DEFAULT_TONE,
    do: DEFAULT_DO.map((line) => line.replace("{Company}", company)),
    avoid: DEFAULT_AVOID,
    links: [],
    ...partial,
  };
}

// The demo brand. Value prop and ICPs are written in the shape the brand
// onboarding produces (product map, step 2 of 3) — assumed copy, replace freely.
const zune: BrandFixture = {
  key: "zune",
  slug: "zune",
  company: "Zune",
  website: "https://zune.dev",
  valueProp:
    "Zune is an AI outbound workspace for early-stage B2B SaaS teams. It researches accounts, drafts personalised " +
    "sequences in the founder's voice and books meetings straight into the calendar, so a two-person team can run " +
    "outbound like a ten-person SDR org. Teams switch from generic sequencers because replies go up and the admin " +
    "goes away. It plugs into HubSpot, Attio and Pipedrive in one click.",
  icps: [
    {
      title: "Founder / CEO of early-stage SaaS",
      description:
        "Pre-seed to Series A, doing founder-led sales, no SDR yet. Wants meetings without hiring; distrusts tools that spam.",
    },
    {
      title: "Head of Growth / GTM at a 10–50 person SaaS",
      description:
        "Owns pipeline targets, runs outbound + content, measured on qualified meetings. Cares about reply rate and CRM hygiene.",
    },
    {
      title: "First sales hire / AE at a seed-stage startup",
      description:
        "Alone on the sales side, needs research and first drafts done for them so the day goes to conversations, not tabs.",
    },
  ],
  targetIndustries: ["B2B", "SaaS", "AI", "Sales", "Growth / GTM"],
  targetRegions: ["Europe", "North America"],
  pixelSiteKey: `nn_${hex(32)}`,
  owner: { firstName: "Demo", lastName: "Brand", email: "brand@demo.naano" },
  topupCents: 1_000_000,
  campaigns: [
    {
      key: "zune-main",
      name: "Zune creator brief",
      description: "Founder-led outbound without the admin. Creators show what changes when research and drafts are done for you.",
      status: "active",
      openToApplications: true,
      postDeadline: daysFromNow(12),
      defaultFeeCents: 40_000,
      createdAt: daysAgo(31),
      brief: brief("Zune", {
        whatToTell:
          "Zune does the research and the first draft for founder-led outbound, so small SaaS teams book meetings without hiring SDRs. Show a concrete before/after from your own experience with outbound.",
        targetIndustries: ["B2B", "SaaS", "AI", "Sales", "Growth / GTM"],
        links: ["https://zune.dev", "https://zune.dev/docs/getting-started"],
        angles: [
          {
            angle: "A practical introduction",
            hook: "Founder-led outbound dies at the research step, not the writing step.",
            direction: "Walk through what a week of outbound looks like with research and drafts done for you. Keep it concrete: accounts, hours, replies.",
            example:
              "I used to spend Sunday nights building lists. This week the list, the context and the first draft were waiting on Monday. I only did the conversations. Here's what changed in the numbers.",
          },
          {
            angle: "The two-person SDR org",
            hook: "You don't need an SDR. You need the SDR's Tuesday.",
            direction: "Contrast hiring a first SDR with keeping outbound founder-led but tooled. No dunking on SDRs.",
            example:
              "Hiring an SDR at seed is a €60K bet on a process you haven't proven. We proved it first with two people and a tool that does the boring half. Then we hired.",
          },
          {
            angle: "Reply rate over volume",
            hook: "We sent 70% fewer emails and booked more meetings.",
            direction: "Explain why personalised research beats volume, with one real anecdote. Disclose the partnership in the first three lines.",
            example:
              "Sponsored, and I'd say this anyway: the fastest way to fix reply rate is to stop sending to people you haven't read about. Zune reads first. We sent fewer, better emails.",
          },
        ],
      }),
    },
    {
      key: "zune-q4",
      name: "Zune — Q4 founders push",
      description: "Second wave targeting founders in DACH and the Nordics.",
      status: "draft",
      openToApplications: false,
      postDeadline: null,
      defaultFeeCents: 40_000,
      createdAt: daysAgo(3),
      brief: brief("Zune", {
        whatToTell: "Same product story, angled at founders raising or just raised who need pipeline before the next round.",
        targetGeos: ["Europe"],
        angles: [
          {
            angle: "Pipeline before the round",
            hook: "Investors don't fund outbound plans. They fund outbound results.",
            direction: "Draft — to be completed with AI.",
            example: "",
          },
        ],
      }),
    },
  ],
};

const premiumInboxes: BrandFixture = {
  key: "premium-inboxes",
  slug: "premium-inboxes",
  company: "Premium Inboxes",
  website: "https://premiuminboxes.com",
  valueProp:
    "Premium Inboxes provides pre-warmed sending domains and mailboxes so outbound teams land in the inbox from day one.",
  icps: [
    { title: "Head of Outbound at a B2B SaaS", description: "Runs cold email at scale, fights deliverability every week." },
    { title: "Lead-gen agency founder", description: "Manages dozens of client domains and can't afford a blacklisting." },
    { title: "SDR team lead", description: "Owns reply rate targets and mailbox health for a team of 5–15." },
  ],
  targetIndustries: ["Outreach", "Sales", "B2B"],
  targetRegions: ["Europe", "North America"],
  pixelSiteKey: `nn_${hex(32)}`,
  owner: { firstName: "Léa", lastName: "Moreau", email: "lea@premiuminboxes.example" },
  topupCents: 600_000,
  campaigns: [
    {
      key: "pi-main",
      name: "Main campaign",
      description: "Deliverability stories from people who run outbound for a living.",
      status: "active",
      openToApplications: true,
      postDeadline: daysFromNow(6),
      defaultFeeCents: 30_000,
      createdAt: daysAgo(20),
      brief: brief("Premium Inboxes", {
        whatToTell: "Warm domains and mailboxes that land in the inbox on day one. Tell a deliverability story from your own outbound.",
        targetIndustries: ["Outreach", "Sales", "B2B"],
        links: ["https://premiuminboxes.com"],
        angles: [
          {
            angle: "The day the domain got burned",
            hook: "We lost a month of pipeline to one blacklisting.",
            direction: "Personal story, then what you'd do differently with pre-warmed infrastructure.",
            example: "Our reply rate went from 9% to 0.4% in a week. Nobody changed the copy. The domain was gone.",
          },
        ],
      }),
    },
    {
      key: "pi-spring",
      name: "Launch — spring wave",
      description: "First creator wave for the new inbox rotation feature.",
      status: "completed",
      openToApplications: false,
      postDeadline: daysAgo(40),
      defaultFeeCents: 30_000,
      createdAt: daysAgo(75),
      brief: brief("Premium Inboxes", {
        whatToTell: "Inbox rotation launch: spread sends across mailboxes automatically.",
        targetIndustries: ["Outreach", "Sales"],
        angles: [
          {
            angle: "Rotation, explained simply",
            hook: "One mailbox sending 200 emails a day is a smoke signal.",
            direction: "Explain rotation like you'd explain it to a founder.",
            example: "Spread 200 sends over 10 mailboxes and every one of them looks human. That's the whole trick.",
          },
        ],
      }),
    },
  ],
};

const orbisearch: BrandFixture = {
  key: "orbisearch",
  slug: "orbisearch",
  company: "OrbiSearch",
  website: "https://orbisearch.example",
  valueProp: "OrbiSearch is enterprise search for product and support teams: one box over docs, tickets and Slack.",
  icps: [
    { title: "Head of Support at a scale-up", description: "Wants agents to find the answer in one search, not five tabs." },
    { title: "Product Ops lead", description: "Owns internal knowledge; tired of stale wikis." },
    { title: "CTO of a 50–200 person SaaS", description: "Evaluates search and RAG tooling, cares about permissions." },
  ],
  targetIndustries: ["Customer Support", "Productivity", "AI", "SaaS"],
  targetRegions: ["Europe", "North America"],
  pixelSiteKey: `nn_${hex(32)}`,
  owner: { firstName: "Jonas", lastName: "Weber", email: "jonas@orbisearch.example" },
  topupCents: 400_000,
  campaigns: [
    {
      key: "orbi-main",
      name: "Main campaign",
      description: "Show what changes when support finds answers in one search.",
      status: "active",
      openToApplications: true,
      postDeadline: daysFromNow(6),
      defaultFeeCents: 35_000,
      createdAt: daysAgo(18),
      brief: brief("OrbiSearch", {
        whatToTell: "One search box over docs, tickets and Slack. Tell the story of a support or product team that stopped hunting for answers.",
        targetIndustries: ["Customer Support", "Productivity", "AI"],
        links: ["https://orbisearch.example"],
        angles: [
          {
            angle: "Five tabs to one",
            hook: "Your support team's real job is search.",
            direction: "Quantify the tab-hunting. Then show one search.",
            example: "I timed it: 4 minutes 20 seconds per ticket spent looking, not answering. That's the whole product story.",
          },
        ],
      }),
    },
  ],
};

export const BRANDS: BrandFixture[] = [zune, premiumInboxes, orbisearch];
