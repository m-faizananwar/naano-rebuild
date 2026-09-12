// The liquid-glass filter (docs/reference/glass-card-spec.md §3), rendered once.
// feTurbulence is the refraction normal map. SourceAlpha pushed to full,
// blurred (45) and inverted (slope -1.3) becomes an edge mask that is ~0 in the
// interior and rises at the rim; the noise is multiplied by it so displacement
// only bites near the borders (the glass bevel). SourceGraphic is displaced
// three times at 65 / 56 / 47, each masked to one channel and recombined with
// screen blends: the per-channel spread is the rainbow fringe. The -30%/160%
// region gives blur and displacement room past the element bounds.
export function GlassFilterDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}>
      <defs>
        <filter id="liquid-glass-refraction" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.015" numOctaves="3" result="noise" />
          <feColorMatrix in="SourceAlpha" type="matrix" result="boosted_alpha" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 100 0" />
          <feGaussianBlur in="boosted_alpha" stdDeviation="45" result="blurred_alpha" />
          <feComponentTransfer in="blurred_alpha" result="edge_mask">
            <feFuncA type="linear" slope="-1.3" intercept="1" />
          </feComponentTransfer>
          <feComposite in="noise" in2="edge_mask" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="masked_noise" />
          {/* chromatic dispersion: one displacement pass per channel */}
          <feDisplacementMap in="SourceGraphic" in2="masked_noise" scale="65" xChannelSelector="R" yChannelSelector="G" result="red_displaced" />
          <feColorMatrix in="red_displaced" type="matrix" result="red" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          <feDisplacementMap in="SourceGraphic" in2="masked_noise" scale="56" xChannelSelector="R" yChannelSelector="G" result="green_displaced" />
          <feColorMatrix in="green_displaced" type="matrix" result="green" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          <feDisplacementMap in="SourceGraphic" in2="masked_noise" scale="47" xChannelSelector="R" yChannelSelector="G" result="blue_displaced" />
          <feColorMatrix in="blue_displaced" type="matrix" result="blue" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="chromatic_dispersion" />
        </filter>
      </defs>
    </svg>
  );
}
