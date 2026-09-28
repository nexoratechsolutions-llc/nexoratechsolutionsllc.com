/* Decorative hero visuals. Purely presentational — hidden from assistive tech. */

function Rings() {
  return (
    <>
      <g className="orbit-ring">
        <circle cx="200" cy="200" r="150" stroke="var(--line-strong)" strokeWidth="1" fill="none" />
        <circle cx="200" cy="50" r="2.5" fill="var(--accent)" />
      </g>
      <g className="orbit-ring rev">
        <circle cx="200" cy="200" r="105" stroke="var(--line-strong)" strokeWidth="1" fill="none" strokeDasharray="2 8" />
        <circle cx="305" cy="200" r="2.5" fill="var(--accent2)" />
      </g>
      <circle className="orbit-halo" cx="200" cy="200" r="60" fill="url(#orbitGlow)" />
    </>
  )
}

function Defs() {
  return (
    <defs>
      <radialGradient id="orbitGlow">
        <stop offset="0%" stopColor="var(--accent)" stopOpacity=".28" />
        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

export function TechOrbit() {
  return (
    <div className="orbit" aria-hidden="true">
      <svg viewBox="0 0 400 400">
        <Defs />
        <Rings />
        <line x1="200" y1="200" x2="200" y2="60" stroke="var(--accent)" strokeWidth="1" opacity=".5" />
        <line x1="200" y1="200" x2="320" y2="270" stroke="var(--accent2)" strokeWidth="1" opacity=".5" />
        <line x1="200" y1="200" x2="90" y2="280" stroke="var(--ink-faint)" strokeWidth="1" opacity=".5" />
        <line x1="200" y1="200" x2="300" y2="130" stroke="var(--ink-faint)" strokeWidth="1" opacity=".4" />
        <circle cx="200" cy="200" r="9" fill="var(--ink)" />
        <circle className="node-pulse d1" cx="200" cy="60" r="6" fill="var(--accent)" />
        <circle className="node-pulse d2" cx="320" cy="270" r="6" fill="var(--accent2)" />
        <circle className="node-pulse d3" cx="90" cy="280" r="6" fill="var(--ink-faint)" />
        <circle className="node-pulse d4" cx="300" cy="130" r="6" fill="var(--accent)" />
        <g className="orbit-labels">
          <text x="200" y="38">DISCOVER</text>
          <text x="338" y="298">SCALE</text>
          <text x="72" y="308">BUILD</text>
          <text x="330" y="118">SHIP</text>
        </g>
      </svg>
    </div>
  )
}

export function MedOrbit() {
  return (
    <div className="orbit" aria-hidden="true">
      <svg viewBox="0 0 400 400">
        <Defs />
        <Rings />
        <line x1="200" y1="200" x2="200" y2="50" stroke="var(--accent)" strokeWidth="1" opacity=".5" />
        <line x1="200" y1="200" x2="350" y2="200" stroke="var(--accent2)" strokeWidth="1" opacity=".5" />
        <line x1="200" y1="200" x2="200" y2="350" stroke="var(--ink-faint)" strokeWidth="1" opacity=".5" />
        <line x1="200" y1="200" x2="50" y2="200" stroke="var(--ink-faint)" strokeWidth="1" opacity=".5" />
        <rect x="190" y="178" width="20" height="44" rx="3" fill="var(--accent)" />
        <rect x="178" y="190" width="44" height="20" rx="3" fill="var(--accent)" />
        <circle className="node-pulse d1" cx="200" cy="50" r="6" fill="var(--accent)" />
        <circle className="node-pulse d2" cx="350" cy="200" r="6" fill="var(--accent2)" />
        <circle className="node-pulse d3" cx="200" cy="350" r="6" fill="var(--ink-faint)" />
        <circle className="node-pulse d4" cx="50" cy="200" r="6" fill="var(--accent)" />
        <g className="orbit-labels">
          <text x="200" y="30">COACHING</text>
          <text x="350" y="228">ROTATIONS</text>
          <text x="200" y="378">RESEARCH</text>
          <text x="50" y="228">MATCH</text>
        </g>
      </svg>
    </div>
  )
}
