/* eslint-disable no-restricted-syntax -- spec-exact SVG gradient stops and fills (docs/reference/metric-cards-spec.md), not UI colours */
// SVG art for the metric-cards stage, lifted from public/performance/index.html
// (docs/reference/metric-cards-spec.md). Attribute names are JSX-cased; the
// paths, gradients, masks, filters and seeds are the standalone's.

export function StageFilterDefs() {
  return (
    <svg className="filter-defs" aria-hidden="true">
    <defs>
      <filter id="cardNoise" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".54" numOctaves="3" seed="27" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer><feFuncR type="linear" slope="1.8" intercept="-.25"/><feFuncG type="linear" slope="1.8" intercept="-.25"/><feFuncB type="linear" slope="1.8" intercept="-.25"/><feFuncA type="table" tableValues="0 .52"/></feComponentTransfer>
      </filter>
      <filter id="panelNoiseF" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="13" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    </defs>
  </svg>
  );
}

export function PaperTexture() {
  return (
    <svg className="paper-texture" aria-hidden="true">
    <defs>
      <filter id="paperNoise"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="8" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
      <pattern id="paperFiber" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(17)"><rect width="6" height="1" fill="rgba(0,0,0,.03)"/></pattern>
    </defs>
    <rect width="100%" height="100%" filter="url(#paperNoise)" opacity=".2"/><rect width="100%" height="100%" fill="url(#paperFiber)"/>
  </svg>
  );
}

export function GaugeArt() {
  return (
    <svg className="gauge" viewBox="0 0 326 326" aria-hidden="true">
        <defs>
          <linearGradient id="gaugeArc" gradientUnits="userSpaceOnUse" x1="7" y1="136" x2="312" y2="109">
            <stop offset="0" stopColor="#ff9ab7" stopOpacity=".06"/><stop offset=".08" stopColor="#ff8caf" stopOpacity=".44"/><stop offset=".34" stopColor="#ff6796" stopOpacity=".94"/><stop offset=".58" stopColor="#ff6796" stopOpacity="1"/><stop offset=".82" stopColor="#ffe7ed" stopOpacity=".74"/><stop offset=".94" stopColor="#fff8fa" stopOpacity=".28"/><stop offset="1" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="gaugeShadow" gradientUnits="userSpaceOnUse" x1="11" y1="136" x2="308" y2="110">
            <stop offset="0" stopColor="#6e1639" stopOpacity=".04"/><stop offset=".09" stopColor="#6e1639" stopOpacity=".17"/><stop offset=".52" stopColor="#72163d" stopOpacity=".18"/><stop offset=".78" stopColor="#7b1a43" stopOpacity=".1"/><stop offset="1" stopColor="#7b1a43" stopOpacity="0"/>
          </linearGradient>
          <radialGradient id="radarBeam" gradientUnits="userSpaceOnUse" cx="163" cy="163" r="145">
            <stop offset=".3" stopColor="#650f35" stopOpacity="0"/><stop offset=".45" stopColor="#650f35" stopOpacity=".025"/><stop offset=".7" stopColor="#650f35" stopOpacity=".065"/><stop offset=".9" stopColor="#650f35" stopOpacity=".08"/><stop offset="1" stopColor="#650f35" stopOpacity=".05"/>
          </radialGradient>
          <linearGradient id="radarBeamEdge" gradientUnits="userSpaceOnUse" x1="238" y1="33" x2="190.5" y2="115.4">
            <stop offset="0" stopColor="#ffe7ef" stopOpacity=".19"/><stop offset=".48" stopColor="#ffd1df" stopOpacity=".11"/><stop offset=".82" stopColor="#ffc6d7" stopOpacity=".045"/><stop offset="1" stopColor="#ffc6d7" stopOpacity="0"/>
          </linearGradient>
          <filter id="radarSoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.35"/></filter>
          <filter id="radarHalo" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5.2"/></filter>
          <filter id="gaugeBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="11"/></filter>
        </defs>
        <path className="arc-shadow" d="M11.34 136.26A154 154 0 0 1 307.71 110.33" fill="none" stroke="url(#gaugeShadow)" strokeWidth="3.2" strokeLinecap="round"/>
        <path className="outer-ring" d="M6.91 135.48A158.5 158.5 0 0 1 311.94 108.79" fill="none" stroke="url(#gaugeArc)" strokeWidth="2.2" strokeLinecap="round"/>
        <path className="fine-ring" d="M19.22 137.65A146 146 0 0 1 236 36.56" fill="none" stroke="rgba(255,166,194,.31)" strokeWidth="1.15"/>
        <path d="M238 33.1A150 150 0 0 1 277.9 66.6L199.8 119.5A55 55 0 0 0 190.5 115.4Z" fill="#6a1238" opacity=".022" filter="url(#radarHalo)"/>
        <path className="radar-sweep" d="M238 33.1A150 150 0 0 1 277.9 66.6L199.8 119.5A55 55 0 0 0 190.5 115.4Z" fill="url(#radarBeam)" filter="url(#radarSoft)"/>
        <path d="M238 33.1L190.5 115.4" stroke="url(#radarBeamEdge)" strokeWidth="1.25" strokeLinecap="round" filter="url(#radarSoft)"/>
        <g className="gauge-ticks" />
        <ellipse cx="225" cy="166" rx="92" ry="76" fill="#fff" opacity=".055" filter="url(#gaugeBlur)"/>
      </svg>
  );
}

export function ContextWallArt() {
  return (
    <svg className="context-backdrop" viewBox="0 0 429 554" preserveAspectRatio="none">
          <defs>
            <linearGradient id="tTLf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d4b0ee" stopOpacity=".05"/><stop offset="1" stopColor="#c6bbff" stopOpacity=".18"/></linearGradient>
            <linearGradient id="tTCf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d5c2ff" stopOpacity=".22"/><stop offset=".38" stopColor="#e0bdff" stopOpacity=".26"/><stop offset=".72" stopColor="#f2a0ee" stopOpacity=".32"/><stop offset="1" stopColor="#ff96da" stopOpacity=".34"/></linearGradient>
            <linearGradient id="tTCshade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#000"/></linearGradient>
            <mask id="tTCshadeM"><rect x="88" y="22" width="247" height="150" fill="url(#tTCshade)"/></mask>
            <linearGradient id="tTRf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe8da" stopOpacity=".56"/><stop offset=".5" stopColor="#f9c6d0" stopOpacity=".26"/><stop offset="1" stopColor="#eba4bf" stopOpacity=".08"/></linearGradient>
            <linearGradient id="tMLf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c9a5f0" stopOpacity=".34"/><stop offset="1" stopColor="#8e5bb8" stopOpacity=".22"/></linearGradient>
            <radialGradient id="tMLx" cx=".5" cy=".3" r=".8"><stop offset="0" stopColor="#e5c8ff" stopOpacity=".26"/><stop offset="1" stopColor="#e5c8ff" stopOpacity="0"/></radialGradient>
            <linearGradient id="tMCf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f5d3fb" stopOpacity=".18"/><stop offset="1" stopColor="#d98ad8" stopOpacity=".30"/></linearGradient>
            <linearGradient id="tMRf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e858b8" stopOpacity=".52"/><stop offset=".5" stopColor="#e6459c" stopOpacity=".46"/><stop offset="1" stopColor="#de74ba" stopOpacity=".16"/></linearGradient>
            <linearGradient id="mrLShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000"/><stop offset=".4" stopColor="#fff"/></linearGradient>
            <mask id="mrLShadeM"><rect x="344" y="175" width="113" height="176" fill="url(#mrLShade)"/></mask>
            <linearGradient id="deepX" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5a1230" stopOpacity=".9"/><stop offset=".36" stopColor="#ff7c66" stopOpacity=".7"/><stop offset=".68" stopColor="#ff9ad9" stopOpacity=".62"/><stop offset="1" stopColor="#8fb0ff" stopOpacity=".55"/></linearGradient>
            <linearGradient id="deepMg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff"/><stop offset=".55" stopColor="#fff" stopOpacity=".5"/><stop offset="1" stopColor="#000"/></linearGradient>
            <mask id="deepM"><rect x="-24" y="384" width="480" height="170" fill="url(#deepMg)"/></mask>
            <linearGradient id="gV1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4b1341" stopOpacity=".55"/><stop offset="1" stopColor="#4b1341" stopOpacity=".2"/></linearGradient>
            <linearGradient id="gV2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4b1341" stopOpacity=".5"/><stop offset="1" stopColor="#6d1a55" stopOpacity=".25"/></linearGradient>
            <linearGradient id="gH1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3e0f36" stopOpacity=".35"/><stop offset=".5" stopColor="#5a1748" stopOpacity=".55"/><stop offset="1" stopColor="#3e0f36" stopOpacity=".35"/></linearGradient>
            <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".28"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
            <linearGradient id="wallMg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff"/><stop offset=".85" stopColor="#fff"/><stop offset="1" stopColor="#000"/></linearGradient>
            <mask id="wallM"><rect width="429" height="554" fill="url(#wallMg)"/></mask>
            <mask id="tileRowsM"><rect x="0" y="0" width="429" height="360" fill="#fff"/></mask>
            <mask id="noiseM"><rect width="429" height="554" fill="url(#wallMg)"/></mask>
            <mask id="tB3m"><rect x="0" y="384" width="429" height="170" fill="url(#deepMg)"/></mask>
            <filter id="tileSoft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.4"/></filter>
            <filter id="groutSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6.5"/></filter>
            <filter id="wallNoiseF"><feTurbulence type="fractalNoise" baseFrequency=".62" numOctaves="2" seed="71" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
            <filter id="deepNoiseF"><feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="2" seed="57" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
            <filter id="wallNoiseF2"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="29" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          </defs>
          <g mask="url(#wallM)">
            <g mask="url(#tileRowsM)" filter="url(#tileSoft)">
              {/* top row */}
              <rect x="-24" y="22" width="106" height="149" rx="15" fill="url(#tTLf)"/>
              <rect x="88" y="22" width="247" height="150" rx="15" fill="url(#tTCf)"/>
              <rect x="88" y="22" width="247" height="150" rx="15" fill="#6a2a7a" opacity=".18" mask="url(#tTCshadeM)"/>
              <rect x="88" y="22" width="247" height="46" rx="15" fill="url(#sheen)"/>
              <rect x="346" y="22" width="111" height="147" rx="15" fill="url(#tTRf)"/>
              <rect x="346" y="22" width="111" height="46" rx="15" fill="url(#sheen)"/>
              {/* middle row */}
              <rect x="-24" y="177" width="108" height="174" rx="15" fill="url(#tMLf)"/>
              <rect x="-24" y="177" width="108" height="174" rx="15" fill="url(#tMLx)"/>
              <rect x="-24" y="177" width="108" height="52" rx="15" fill="url(#sheen)"/>
              <rect x="88" y="177" width="247" height="174" rx="15" fill="url(#tMCf)"/>
              <rect x="344" y="175" width="113" height="176" rx="15" fill="url(#tMRf)"/>
              <rect x="344" y="175" width="113" height="176" rx="15" fill="#5a1445" opacity=".2" mask="url(#mrLShadeM)"/>
            </g>
            {/* deep band */}
            <rect x="-24" y="384" width="480" height="170" fill="url(#deepX)" mask="url(#deepM)"/>
            {/* grout */}
            <g filter="url(#groutSoft)">
              <rect x="81" y="30" width="8" height="150" fill="url(#gV1)"/>
              <rect x="338" y="30" width="8" height="322" fill="url(#gV2)"/>
              <rect x="0" y="167" width="429" height="12" fill="url(#gH1)"/>
              <ellipse cx="210" cy="356" rx="140" ry="18" fill="#5a1748" opacity=".28"/>
              <ellipse cx="330" cy="176" rx="40" ry="14" fill="#c23a9a" opacity=".22"/>
            </g>
            <ellipse cx="352" cy="86" rx="140" ry="108" fill="#fff" opacity=".07" filter="url(#groutSoft)"/>
            <ellipse cx="75" cy="150" rx="82" ry="54" fill="#fff6ff" opacity=".12" filter="url(#groutSoft)"/>
            <ellipse cx="8" cy="334" rx="76" ry="58" fill="#3b0f34" opacity=".18" filter="url(#groutSoft)"/>
            <ellipse cx="56" cy="215" rx="56" ry="62" fill="#a06cf0" opacity=".14" filter="url(#groutSoft)"/>
            <rect width="429" height="554" filter="url(#wallNoiseF)" opacity=".34" style={{ mixBlendMode: "soft-light" }} mask="url(#noiseM)"/>
            <rect x="0" y="400" width="429" height="154" filter="url(#deepNoiseF)" opacity=".22" style={{ mixBlendMode: "soft-light" }} mask="url(#tB3m)"/>
            <rect x="-24" y="177" width="108" height="174" rx="15" filter="url(#wallNoiseF2)" opacity=".3" style={{ mixBlendMode: "soft-light" }}/>
            <rect x="344" y="175" width="113" height="176" rx="15" filter="url(#wallNoiseF2)" opacity=".3" style={{ mixBlendMode: "soft-light" }}/>
          </g>
        </svg>
  );
}

export function ConnectionsMapArt() {
  return (
    <svg className="connections-map" viewBox="0 0 429 238" preserveAspectRatio="none" aria-hidden="true">
        <g fill="none" stroke="#fff" strokeWidth="1">
          <path opacity=".20" d="M0 5H128c27 0 36 7 39 26 2 16 9 22 24 22h106c16 0 23-8 25-25 2-16 10-23 31-23h76"/>
          <path opacity=".30" d="M0 117h46c15 0 22 8 26 25 5 23 12 31 31 31h174c18 0 25-8 30-31 4-17 11-25 26-25h96"/>
          <path opacity=".34" d="M0 173h87c15 0 22 7 27 25 4 15 11 22 28 22h140c17 0 25-7 29-22 5-18 12-25 28-25h90"/>
          <path opacity=".16" d="M0 228h120c17 0 25-5 28-18 4-15 10-20 28-20h81c18 0 25 6 28 20 4 13 11 18 28 18h116"/>
          <path opacity=".26" d="M0 5H429M0 61H429M0 117H429"/>
          <path opacity=".09" d="M0 173H429"/>
        </g>
        <g fill="none" stroke="#fff8dd" strokeWidth="1.15">
          <path opacity=".52" d="M0 61h95c14 0 22-6 27-20 4-13 12-20 27-20h115c15 0 23 6 27 20 5 14 13 20 28 20h110"/>
          <path opacity=".94" d="M0 117h88c15 0 22-8 25-25 4-24 12-31 31-31h129c20 0 27 7 31 31 3 17 10 25 26 25h99"/>
        </g>
        <circle cx="45" cy="117" r="6.5" fill="#fff"/><circle cx="133" cy="61" r="6.5" fill="#fff4a7"/><circle cx="189" cy="61" r="6.5" fill="#fff1a4"/><circle cx="319" cy="61" r="6.5" fill="#fff4a6"/><circle cx="319" cy="117" r="6.5" fill="#fff2a0"/>
      </svg>
  );
}
