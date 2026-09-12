"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/config/brand";

// The pixel global installed by /n.js — the identifier must match BRAND.pixelGlobal.
declare global {
  interface Window {
    amplio?: (...args: unknown[]) => void;
  }
}

const DEMO_PRICE = 49;

// Calls the pixel exactly the way a customer's product would.
export function DemoLandingActions() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState<"signup" | "purchase" | null>(null);

  function track(type: "signup" | "purchase") {
    if (!window.amplio) {
      toast.error("The pixel did not load on this page");
      return;
    }
    if (type === "signup") window.amplio("track", "signup", { email });
    else window.amplio("track", "purchase", { value: DEMO_PRICE, order_id: `demo-${Date.now()}` });
    setDone(type);
    toast.success(type === "signup" ? `${BRAND.pixelGlobal}('track', 'signup') sent` : `${BRAND.pixelGlobal}('track', 'purchase') sent`);
  }

  return (
    <div className="grid gap-6 rounded-2xl border bg-background p-6">
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          track("signup");
        }}
      >
        <Label htmlFor="demo-email">Work email</Label>
        <Input id="demo-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        <Button type="submit">Start free trial</Button>
        <p className="text-xs text-muted-foreground">Submitting calls {BRAND.pixelGlobal}(&apos;track&apos;, &apos;signup&apos;, {"{ email }"}).</p>
      </form>
      <div className="grid gap-2">
        <Button type="button" variant="outline" onClick={() => track("purchase")}>
          Buy the €{DEMO_PRICE} plan
        </Button>
        <p className="text-xs text-muted-foreground">Calls {BRAND.pixelGlobal}(&apos;track&apos;, &apos;purchase&apos;, {"{ value: 49, order_id }"}).</p>
      </div>
      {done ? (
        <p className="rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand" role="status">
          Event sent. It is now a row in pixel_events, attributed to the click that brought you here (if any). Check Brand › Results.
        </p>
      ) : null}
    </div>
  );
}
