"use client";

import { useRef, useState } from "react";
import { CardBack } from "./CardBack";
import { CardFront } from "./CardFront";
import { useCardFieldMotion } from "./useCardFieldMotion";
import type { CardModel } from "./toCardModel";

// Front/back flip (CSS 3D). Both faces stay mounted so the flip animates;
// the hidden face is inert for assistive tech.
export function LiveCard({ model }: { model: CardModel }) {
  const [flipped, setFlipped] = useState(false);
  const front = useRef<HTMLDivElement>(null);
  // stats flip and the industry line slides whenever one of these changes
  useCardFieldMotion(front, [model.followers, model.medianViews, model.priceCents, model.industries.join("|"), model.hasPostData].join("/"));
  return (
    <div className="w-full max-w-md [perspective:1600px]">
      <div
        className="relative grid transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div ref={front} className="col-start-1 row-start-1 [backface-visibility:hidden]" inert={flipped || undefined} aria-hidden={flipped}>
          <CardFront model={model} onMore={() => setFlipped(true)} />
        </div>
        <div className="col-start-1 row-start-1 [backface-visibility:hidden] [transform:rotateY(180deg)]" inert={!flipped || undefined} aria-hidden={!flipped}>
          <CardBack model={model} onBack={() => setFlipped(false)} />
        </div>
      </div>
    </div>
  );
}
