import { STUDIO_COPY } from "@/features/public/components/gaze-footer/footer-copy";
import { GazeFooter } from "@/features/public/components/gaze-footer/GazeFooter";
import { StudioLogo } from "@/features/public/components/gaze-footer/StudioLogo";

// The gaze-scrub footer built to docs/reference/gaze-footer-spec.md as its own
// route: the spec's copy, the Logoipsum logo, static labels. `.gaze` carries the
// spec's :root/body rules so they stay scoped to this page.
export default function StudioFooterPage() {
  return (
    <div className="gaze">
      <GazeFooter copy={STUDIO_COPY} logo={<StudioLogo />} logoLabel="Studio logo" />
    </div>
  );
}
