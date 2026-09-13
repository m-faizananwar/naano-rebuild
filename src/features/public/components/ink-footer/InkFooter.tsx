import { Poppins } from "next/font/google";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { INK_BLURB, INK_COLUMNS, INK_CONTACTS, INK_LEGAL, INK_LETTER, INK_SOCIALS } from "./footer-links";
import { BrandMark } from "@/components/brand/BrandMark";
import { EnvelopeIcon, InstagramIcon, LinkedInIcon, PhoneIcon, PinIcon, TikTokIcon, XIcon } from "./InkIcons";
import { FooterMedia } from "./FooterMedia";
import { NewsletterForm } from "./NewsletterForm";
import "./ink-footer.css";

// Poppins is footer-only (self-hosted by next/font); Cormorant comes from the root layout (--font-cormorant).
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-poppins", display: "swap" });

const SOCIAL_ICONS = { LinkedIn: LinkedInIcon, X: XIcon, Instagram: InstagramIcon, TikTok: TikTokIcon } as const;

// docs/reference/ink-footer-spec.md ported to React: same DOM, same css and
// animations (ink-footer.css), our copy in the same slots. Cream and ink
// tokens live on .site-footer; the seam above it is a plain edge.
export function InkFooter() {
  return (
    <footer className={`site-footer under-sticky-nav ${poppins.variable}`}>
      <FooterMedia />
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="brand">
            <div className="brand-lockup">
              <BrandMark size={74} className="brand-mark" />
              <p className="brand-name">{BRAND.wordmark}</p>
            </div>
            <p className="brand-blurb">{INK_BLURB}</p>
            <ul className="contact-list">
              <li><EnvelopeIcon /><a href={`mailto:${INK_CONTACTS.email}`}>{INK_CONTACTS.email}</a></li>
              <li><PhoneIcon /><a href={INK_CONTACTS.phone.href}>{INK_CONTACTS.phone.label}</a></li>
              <li><PinIcon /><span>{INK_CONTACTS.place}</span></li>
            </ul>
          </div>
          {INK_COLUMNS.map((col) => (
            <nav key={col.heading} className="col" aria-label={col.aria}>
              <h3 className="col-title">{col.heading}</h3>
              <ul className="link-list">
                {col.links.map((link) => <li key={link.label}><Link href={link.href}>{link.label}</Link></li>)}
              </ul>
            </nav>
          ))}
          <div className="newsletter">
            <h3 className="col-title">The Letter</h3>
            <p>{INK_LETTER}</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="footer-bottom">
          <div className="socials">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- the brief asks for href="#" placeholders: no social accounts exist */}
            {INK_SOCIALS.map((name) => { const Icon = SOCIAL_ICONS[name]; return <a key={name} href="#" aria-label={name}><Icon /></a>; })}
          </div>
          <nav className="legal" aria-label="Legal">
            {INK_LEGAL.map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}
          </nav>
        </div>
      </div>
    </footer>
  );
}
