type ColorMode = 'light' | 'dark'

const COLOR_MODE_KEY = 'color-mode'

export function useColorMode() {
  const mode = useState<ColorMode>('color-mode', () => 'light')

  function apply(value: ColorMode) {
    if (import.meta.server) return
    document.documentElement.classList.toggle('dark', value === 'dark')
    localStorage.setItem(COLOR_MODE_KEY, value)
  }

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    apply(mode.value)
  }

  function init() {
    if (import.meta.server) return
    const stored = localStorage.getItem(COLOR_MODE_KEY) as ColorMode | null
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    mode.value = stored ?? preferred
    apply(mode.value)
  }

  return { mode, toggle, init }
}
