import { HOW_IT_WORKS } from "../../../constants";
import { CreatorAvatar } from "../../shared/CreatorAvatar";

export function FindCreatorsMock() {
  return (
    <div className="flex gap-2">
      {HOW_IT_WORKS.fitCards.map((card) => (
        <div key={card.name} className="flex w-[4.2rem] flex-col items-center rounded-lg bg-card p-2 shadow-md ring-1 ring-border/70">
          <CreatorAvatar name={card.name} className="size-9" />
          <p className="mt-1.5 text-[0.65rem] font-semibold">{card.name}</p>
          <p className="text-[0.6rem] text-muted-foreground">
            Fit <span className="font-semibold text-brand">{card.fit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
