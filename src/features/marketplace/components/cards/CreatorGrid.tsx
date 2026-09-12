import type React from "react";
import type { CreatorDto } from "../../schemas";
import { CreatorCard } from "./CreatorCard";

export function CreatorGrid({ creators }: { creators: CreatorDto[] }) {
  // Re-keying on the id set replays the 40ms stagger whenever a filter changes the result.
  const setKey = creators.map((c) => c.id).join(",");
  return (
    <ul key={setKey} style={{ "--stagger": "40ms" } as React.CSSProperties} className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Creators">
      {creators.map((creator, index) => (
        <li key={creator.id} style={{ "--i": index } as React.CSSProperties} className="flex">
          <div className="flex w-full">
            <CreatorCard creator={creator} />
          </div>
        </li>
      ))}
    </ul>
  );
}
