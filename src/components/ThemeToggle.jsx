import { useTheme } from '../hooks/useTheme'
import { Moon, Sun } from './Icons'

/**
 * Light/dark switch. Both icons are always rendered and CSS shows the right
 * one from `data-theme`, so the server-rendered button is correct before
 * React has read the theme.
 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      type="button"
      className="icon-btn theme-toggle"
      onClick={toggle}
      aria-label="Dark mode"
      aria-pressed={theme === null ? undefined : theme === 'dark'}
      title="Toggle light / dark theme"
    >
      <Sun className="sun" size={19} />
      <Moon className="moon" size={18} />
    </button>
  )
}
