import Link from "next/link";
import type { ReactNode } from "react";
import FooterBackground from "./FooterBackground";
import "./gaze-footer.css";

export type GazeFooterCopy = {
  leftBadge: string;
  leftHeadline: [string, string];
  labels: Array<{ label: string; href?: string }>;
  rightBadge: string;
  rightHeadline: [string, string];
  note: string;
};

type Props = { copy: GazeFooterCopy; logo: ReactNode; logoLabel: string };

// docs/reference/gaze-footer-spec.md, app/page.tsx — the markup verbatim, with
// the copy and the logo as props so the standalone route and the landing share
// one component. Labels render as links only when a href is given (the
// landing); the standalone keeps them as static spans, as the spec says.
export function GazeFooter({ copy, logo, logoLabel }: Props) {
  return (
    <footer className="footer" aria-label="Footer">
      <FooterBackground />
      <div className="jobs">
        <span className="tag">{copy.leftBadge}</span>
        <span className="headline job-title">{copy.leftHeadline[0]}<br />{copy.leftHeadline[1]}</span>
        <div className="footer-nav">
          {copy.labels.map((item) => (item.href ? <Link key={item.label} href={item.href}>{item.label}</Link> : <span key={item.label}>{item.label}</span>))}
        </div>
      </div>
      <div className="logo" role="img" aria-label={logoLabel}>
        {logo}
      </div>
      <div className="contact">
        <span className="tag">{copy.rightBadge}</span>
        <div className="headline contact-links">
          <span>{copy.rightHeadline[0]}</span>
          <span>{copy.rightHeadline[1]}</span>
        </div>
        <p className="note">{copy.note}</p>
        <div className="socials">
          {/* eslint-disable @next/next/no-img-element -- static monochrome glyphs from public/, as the spec's markup */}
          <span aria-label="LinkedIn"><img src="/linkedin.svg" alt="" width="35" height="35" /></span>
          <span aria-label="Instagram"><img src="/instagram.svg" alt="" width="35" height="35" /></span>
          <span aria-label="TikTok"><img src="/tiktok.svg" alt="" width="35" height="35" /></span>
          {/* eslint-enable @next/next/no-img-element */}
        </div>
      </div>
    </footer>
  );
}
