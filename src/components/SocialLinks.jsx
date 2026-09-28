import { SOCIAL_ICONS } from './Icons'
import { SOCIALS } from '../data/site'

/** Round social-profile buttons; each opens in a new tab. */
export default function SocialLinks({ size = 16, className = '' }) {
  return (
    <ul className={`social-row ${className}`.trim()} aria-label="Nexora on social media">
      {SOCIALS.map((s) => {
        const Icon = SOCIAL_ICONS[s.key]
        return (
          <li key={s.key}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Nexora on ${s.label} (opens in a new tab)`}
              title={s.label}
            >
              <Icon size={size} />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
