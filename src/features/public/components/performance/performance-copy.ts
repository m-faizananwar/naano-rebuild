// Our copy in the spec's slots. Numbers are the seeded benchmark figures.
export const STAGE_COPY = {
  headline: { lead: "Built for ", dots: "Measurable", line2: "Performance" },
  intro: ["Every campaign is engineered for reach, fit and", " attribution, giving your brand the numbers", " to prove what a post produced."],
  learnMore: { label: "Learn More", href: "/benchmarks" },
  cards: {
    speed: { title: ["Cost per lead", "Across 312 campaigns"], dots: "18", unit: "€", caption: ["Median cost", "per qualified lead"] },
    context: { title: ["Click-through rate", "Across 1,847 posts"], dots: "12", unit: "%", caption: ["Average CTR", "vs 0.8% for ads"] },
    connections: { title: ["Vetted creators", "Across 100 countries"], dots: "2.4", unit: "K", caption: ["B2B voices", "ready to collaborate"] },
  },
} as const;

const CF_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P";
const CF_IMAGE = "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P";
export const STAGE_MEDIA = {
  wide: { poster: `${CF_IMAGE}/5c3ec08f-2dbf-4c0a-8588-f6106a789443.webp`, src: `${CF_VIDEO}/hf_20260826_125226_45cb4f38-aa7e-47e1-885d-ae0b69745369.mp4` },
  narrow: { poster: `${CF_IMAGE}/0f4926a4-e660-4df2-9195-2bfb3e341bdd.webp`, src: `${CF_VIDEO}/hf_20260826_125242_daae1570-386d-4bd5-8896-80499e2371e0.mp4` },
  speed: { poster: `${CF_IMAGE}/167977c6-8539-46b1-9a15-8dba566f50b8.png`, src: `${CF_VIDEO}/hf_20260826_130045_1a612b69-4854-4b34-8043-ccb91f2c60af.mp4` },
  context: { poster: `${CF_IMAGE}/0446d1d5-e65e-4db5-8090-3e30d09afc43.png`, src: `${CF_VIDEO}/hf_20260826_130054_dd005674-d693-4d81-80a5-357f7f10b3a3.mp4` },
  connections: { poster: `${CF_IMAGE}/da8d0242-4dee-4f6d-813f-a5887e86ad77.png`, src: `${CF_VIDEO}/hf_20260826_130103_7550f407-f14b-40a6-9616-7a26d7a8bd9f.mp4` },
} as const;
