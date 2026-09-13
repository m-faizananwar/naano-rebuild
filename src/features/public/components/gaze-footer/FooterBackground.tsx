// docs/reference/gaze-footer-spec.md, app/footer-background.tsx — verbatim apart
// from the non-null comment lint asks for. Desktop: pointer → nearest calibrated
// gaze angle → seek; mobile: muted loop.
'use client';

import { useEffect, useRef } from 'react';
import gazeFrames from './gaze-frames.json';

const TAU = Math.PI * 2;
const wrappedAngle = (angle: number) => (angle % TAU + TAU) % TAU;

// These angles were measured from the actual pupil positions in the clip's
// first complete orbit. Match direction, rather than assuming constant speed.
function timeForAngle(angle: number) {
  const target = wrappedAngle(angle);
  let nearestTime = gazeFrames[0][1];
  let nearestDistance = Infinity;
  for (const [sampleAngle, time] of gazeFrames) {
    const difference = Math.abs(target - sampleAngle);
    const distance = Math.min(difference, TAU - difference);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestTime = time;
    }
  }
  return nearestTime + 1 / 240;
}

// `lazy` (the landing section): the clip (1280×720 all-intra, ~2.6MB) has no
// src until the section is one viewport away (rootMargin 100%), then
// preload="auto" so the first frame is painted by the time it scrolls in; the
// poster is that first frame so nothing is ever blank. The standalone keeps
// the spec's eager preload="auto".
export default function FooterBackground({ lazy = false }: { lazy?: boolean } = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // The ref is attached to the video below, so it is set by the time the effect runs.
    const video = videoRef.current!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    let frame = 0;
    let desiredTime = 0;
    let pointer: { x: number; y: number } | null = null;
    let disposed = false;
    const mobile = window.matchMedia('(max-width: 700px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const seek = () => {
      frame = 0;
      if (disposed || mobile.matches || video.readyState < 2 || video.seeking) return;
      if (Math.abs(video.currentTime - desiredTime) > 1 / 48) {
        video.currentTime = Math.min(desiredTime, video.duration - 1 / 24);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(seek);
    };
    const updateTarget = () => {
      if (mobile.matches || !pointer) return;
      const rect = video.getBoundingClientRect();
      // The eye midpoint is (948, 418) in the 1920×1080 source; kept as ratios so the
      // 1280×720 encode (or any size) maps the same, matching object-fit: cover.
      const vw = video.videoWidth || 1920;
      const vh = video.videoHeight || 1080;
      const scale = Math.max(rect.width / vw, rect.height / vh);
      const eyeX = rect.left + rect.width / 2 + (948 / 1920 - 0.5) * vw * scale;
      const eyeY = rect.top + rect.height / 2 + (418 / 1080 - 0.5) * vh * scale;
      const dx = pointer.x - eyeX;
      const dy = pointer.y - eyeY;
      // Avoid unstable angles directly between the eyes.
      if (Math.hypot(dx, dy) > 8) {
        desiredTime = timeForAngle(Math.atan2(dy, dx));
        schedule();
      }
    };
    const move = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      updateTarget();
    };
    const ready = () => {
      video.loop = mobile.matches;
      if (mobile.matches && !reducedMotion.matches) {
        void video.play().catch(() => { /* Keep the first frame if autoplay is unavailable. */ });
      } else {
        video.pause();
        if (!mobile.matches) { updateTarget(); schedule(); }
      }
    };
    // Coalesce fast pointer movements while a frame is decoding. When it
    // finishes, seek immediately to the latest requested gaze direction.
    video.addEventListener('seeked', schedule);
    video.addEventListener('loadeddata', ready);
    mobile.addEventListener('change', ready);
    reducedMotion.addEventListener('change', ready);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('resize', updateTarget);
    window.addEventListener('scroll', updateTarget, { passive: true });
    if (video.readyState >= 2) ready();

    let io: IntersectionObserver | null = null;
    if (lazy) {
      io = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io?.disconnect();
        video.preload = 'auto';
        video.src = '/footer-scrub.mp4';
        video.load();
      }, { rootMargin: '100% 0px' });
      io.observe(video);
    }

    return () => {
      io?.disconnect();
      disposed = true;
      cancelAnimationFrame(frame);
      video.removeEventListener('seeked', schedule);
      video.removeEventListener('loadeddata', ready);
      mobile.removeEventListener('change', ready);
      reducedMotion.removeEventListener('change', ready);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('resize', updateTarget);
      window.removeEventListener('scroll', updateTarget);
    };
  }, []);

  return (
    <div className="footer-background" aria-hidden="true">
      {lazy ? (
        <video ref={videoRef} muted playsInline preload="none" poster="/footer-poster.jpg" />
      ) : (
        <video ref={videoRef} muted playsInline preload="auto" src="/footer-scrub.mp4" />
      )}
    </div>
  );
}
