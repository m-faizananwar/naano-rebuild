import type { CreatorDto } from "../../schemas";
import { CreatorCard } from "./CreatorCard";

export function CreatorGrid({ creators }: { creators: CreatorDto[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Creators">
      {creators.map((creator) => (
        <li key={creator.id} className="flex">
          <div className="flex w-full">
            <CreatorCard creator={creator} />
          </div>
        </li>
      ))}
    </ul>
  );
}
