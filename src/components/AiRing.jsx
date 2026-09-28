import CountUp from './CountUp'

const TONES = { accent: 'var(--accent)', accent2: 'var(--accent2)', sand: '#D8CBA6' }

/** Percentage ring; the arc fills when its Reveal parent scrolls into view (see .ring in pages.css). */
export default function AiRing({ value, tone }) {
  return (
    <div className="ring" style={{ '--target': value, '--c': TONES[tone] }}>
      <CountUp value={`${value}%`} duration={1600} />
    </div>
  )
}
