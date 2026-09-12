import { Skeleton } from "@/components/ui/skeleton";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { COPY } from "../constants";

// The split layout with a form-shaped skeleton: no layout shift between steps.
export function OnboardingLoading() {
  return (
    <AuthSplitLayout panelTitle={COPY.panelTitle} panelBody={COPY.panelBody} panelFootnote={COPY.panelFootnote}>
      <div aria-busy="true" aria-label="Loading">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-9 w-56" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-8 h-12 w-full rounded-xl" />
        <Skeleton className="mt-4 h-12 w-full rounded-xl" />
      </div>
    </AuthSplitLayout>
  );
}
