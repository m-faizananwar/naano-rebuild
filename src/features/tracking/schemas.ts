import { z } from "zod";
import { PIXEL_EVENT_TYPES } from "./constants";

// What /n.js sends to /api/pixel. `site` is the brand's pixel site key.
export const pixelEventSchema = z.object({
  site: z.string().regex(/^nn_[0-9a-f]{32}$/),
  type: z.enum(PIXEL_EVENT_TYPES),
  clickId: z.string().uuid().nullable().optional(),
  visitorId: z.string().max(64).nullable().optional(),
  value: z.number().min(0).max(1_000_000).optional(),
  orderId: z.string().max(120).optional(),
});
export type PixelEventInput = z.infer<typeof pixelEventSchema>;
