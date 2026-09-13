import { Bone } from "./Bone";

export function PageHeaderSkeleton({ withActions = false }: { withActions?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Bone className="h-9 w-56" />
        <Bone className="mt-3 h-4 w-96 max-w-full" />
      </div>
      {withActions ? <Bone className="h-9 w-32 rounded-lg" /> : null}
    </div>
  );
}
