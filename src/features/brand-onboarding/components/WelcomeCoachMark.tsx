import { Suspense } from "react";
import { WelcomeCoachMarkCard } from "./WelcomeCoachMarkCard";

// useSearchParams needs a Suspense boundary; the card renders nothing
// without the welcome params, so this is safe to mount on the page always.
export function WelcomeCoachMark() {
  return (
    <Suspense fallback={null}>
      <WelcomeCoachMarkCard />
    </Suspense>
  );
}
