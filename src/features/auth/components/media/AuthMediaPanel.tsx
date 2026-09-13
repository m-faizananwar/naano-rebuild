import { Plus_Jakarta_Sans } from "next/font/google";
import { AUTH_MEDIA } from "../../constants";
import { InstagramGlyph, LinkedInGlyph, XGlyph } from "./AuthSocialGlyphs";

// Panel-only font (the spec's), self-hosted by next/font; the form column stays Inter.
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-jakarta", display: "swap" });

// The right column of the auth pages: the OceanPulse media card
// (docs/reference/auth-media-spec.md) with our headline above it. Stagger
// indices are the spec's: card 0, video 1, water marker 13/14/15, reef marker
// 16/17/18, pill 19; the headline lines take 9 and 10 like the spec's h1.
export function AuthMediaPanel() {
  return (
    <aside className={`auth-media ${jakarta.variable}`} aria-label="About the platform">
      <div>
        <h2 className="auth-media__title">
          <span className="auth-media__line anim" style={{ "--d": 9 } as React.CSSProperties}>Creators, brands,</span>
          <span className="auth-media__line anim" style={{ "--d": 10 } as React.CSSProperties}><span className="hl">results.</span></span>
        </h2>
        <p className="auth-media__text anim" style={{ "--d": 11 } as React.CSSProperties}>{AUTH_MEDIA.line}</p>
      </div>

      <div className="hero__media anim" style={{ "--d": 0 } as React.CSSProperties} aria-hidden="true">
        <video className="hero__video anim" style={{ "--d": 1 } as React.CSSProperties} autoPlay muted loop playsInline preload="auto" poster={AUTH_MEDIA.poster}>
          <source src={AUTH_MEDIA.video} type="video/mp4" />
        </video>

        <div className="marker marker--water">
          <span className="marker__line anim" style={{ "--d": 14 } as React.CSSProperties} />
          <span className="marker__dot anim" style={{ "--d": 13 } as React.CSSProperties} />
          <span className="marker__label anim" style={{ "--d": 15 } as React.CSSProperties}>{AUTH_MEDIA.waterLabel}</span>
        </div>
        <div className="marker marker--reef marker--right">
          <span className="marker__line anim" style={{ "--d": 17 } as React.CSSProperties} />
          <span className="marker__dot anim" style={{ "--d": 16 } as React.CSSProperties} />
          <span className="marker__label anim" style={{ "--d": 18 } as React.CSSProperties}>{AUTH_MEDIA.reefLabel}</span>
        </div>

        <div className="socials anim" style={{ "--d": 19 } as React.CSSProperties}>
          {/* eslint-disable jsx-a11y/anchor-is-valid -- placeholders as in the spec: no social accounts exist */}
          <a href="#" aria-label="LinkedIn"><LinkedInGlyph /></a>
          <a href="#" aria-label="X"><XGlyph /></a>
          <a href="#" aria-label="Instagram"><InstagramGlyph /></a>
          {/* eslint-enable jsx-a11y/anchor-is-valid */}
        </div>
      </div>
    </aside>
  );
}
