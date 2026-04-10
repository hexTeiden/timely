import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export const THEME_PRESETS = {
  light: {
    name: 'Light',
    icon: 'light_mode',
    bg1: '#eeeef2',
    bg2: '#f5f5f8',
    bg3: '#e4e4ea',
    primary: '#5b5b66',
    secondary: '#8a8a96',
    accent: '#6b6b78',
    text: '#33333a',
    surface: 'rgba(245, 245, 248, 0.7)',
    border: 'rgba(70, 70, 80, 0.1)',
    glow: '0 4px 16px rgba(0, 0, 0, 0.05)',
    dark: false,
  },
  dark: {
    name: 'Dark',
    icon: 'dark_mode',
    bg1: '#1a1a1f',
    bg2: '#23232a',
    bg3: '#2c2c34',
    primary: '#b8b8c4',
    secondary: '#7a7a86',
    accent: '#9a9aa6',
    text: '#d4d4dc',
    surface: 'rgba(35, 35, 42, 0.75)',
    border: 'rgba(255, 255, 255, 0.08)',
    glow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    dark: true,
  },
  cyberpunk: {
    name: 'Cyberpunk',
    icon: 'bolt',
    bg1: '#0a0118',
    bg2: '#1a0533',
    bg3: '#2d0a4e',
    primary: '#ff00aa',
    secondary: '#00f0ff',
    accent: '#fffb00',
    text: '#ffffff',
    surface: 'rgba(20, 5, 40, 0.55)',
    border: 'rgba(255, 0, 170, 0.35)',
    glow: '0 0 24px rgba(255, 0, 170, 0.55)',
    dark: true,
  },
  aurora: {
    name: 'Aurora',
    icon: 'auto_awesome',
    bg1: '#0f2027',
    bg2: '#203a43',
    bg3: '#2c5364',
    primary: '#7afcff',
    secondary: '#feff9c',
    accent: '#fff740',
    text: '#eafffb',
    surface: 'rgba(15, 32, 39, 0.55)',
    border: 'rgba(122, 252, 255, 0.3)',
    glow: '0 0 24px rgba(122, 252, 255, 0.45)',
    dark: true,
  },
  sakura: {
    name: 'Sakura',
    icon: 'local_florist',
    bg1: '#ffe5ec',
    bg2: '#ffc2d1',
    bg3: '#ffb3c6',
    primary: '#ff5d8f',
    secondary: '#c08497',
    accent: '#8b2c5b',
    text: '#3a0a1f',
    surface: 'rgba(255, 255, 255, 0.55)',
    border: 'rgba(255, 93, 143, 0.4)',
    glow: '0 0 24px rgba(255, 93, 143, 0.4)',
    dark: false,
  },
  midnight: {
    name: 'Midnight',
    icon: 'bedtime',
    bg1: '#000000',
    bg2: '#0a0a14',
    bg3: '#13132b',
    primary: '#6366f1',
    secondary: '#a78bfa',
    accent: '#f472b6',
    text: '#e2e8f0',
    surface: 'rgba(15, 15, 30, 0.65)',
    border: 'rgba(99, 102, 241, 0.35)',
    glow: '0 0 24px rgba(99, 102, 241, 0.5)',
    dark: true,
  },
  synthwave: {
    name: 'Synthwave',
    icon: 'waves',
    bg1: '#1a0036',
    bg2: '#3a005c',
    bg3: '#ff006e',
    primary: '#ff006e',
    secondary: '#8338ec',
    accent: '#3a86ff',
    text: '#ffffff',
    surface: 'rgba(26, 0, 54, 0.6)',
    border: 'rgba(255, 0, 110, 0.4)',
    glow: '0 0 30px rgba(255, 0, 110, 0.55)',
    dark: true,
  },
  forest: {
    name: 'Forest',
    icon: 'forest',
    bg1: '#0b3d2e',
    bg2: '#13624a',
    bg3: '#1f8a70',
    primary: '#9be15d',
    secondary: '#00e3ae',
    accent: '#fffd82',
    text: '#f0fff4',
    surface: 'rgba(11, 61, 46, 0.55)',
    border: 'rgba(155, 225, 93, 0.35)',
    glow: '0 0 24px rgba(155, 225, 93, 0.45)',
    dark: true,
  },
  peach: {
    name: 'Peach',
    icon: 'wb_sunny',
    bg1: '#ffecd2',
    bg2: '#fcb69f',
    bg3: '#ff9a8b',
    primary: '#ff6b6b',
    secondary: '#ff8e53',
    accent: '#c9184a',
    text: '#3d0a0a',
    surface: 'rgba(255, 255, 255, 0.55)',
    border: 'rgba(255, 107, 107, 0.4)',
    glow: '0 0 24px rgba(255, 107, 107, 0.4)',
    dark: false,
  },
  mono: {
    name: 'Mono',
    icon: 'circle',
    bg1: '#000000',
    bg2: '#0a0a0a',
    bg3: '#141414',
    primary: '#fafafa',
    secondary: '#71717a',
    accent: '#fbbf24',
    text: '#fafafa',
    surface: 'rgba(15, 15, 15, 0.85)',
    border: 'rgba(255, 255, 255, 0.18)',
    glow: '0 0 24px rgba(255, 255, 255, 0.2)',
    dark: true,
  },
  matrix: {
    name: 'Matrix',
    icon: 'terminal',
    bg1: '#000000',
    bg2: '#001a00',
    bg3: '#003300',
    primary: '#00ff41',
    secondary: '#39ff14',
    accent: '#ccff00',
    text: '#00ff41',
    surface: 'rgba(0, 20, 0, 0.8)',
    border: 'rgba(0, 255, 65, 0.4)',
    glow: '0 0 24px rgba(0, 255, 65, 0.6)',
    dark: true,
  },
  vaporwave: {
    name: 'Vaporwave',
    icon: 'cloud',
    bg1: '#2d1b69',
    bg2: '#ff6ec7',
    bg3: '#00d4ff',
    primary: '#ff71ce',
    secondary: '#01cdfe',
    accent: '#fffb96',
    text: '#ffffff',
    surface: 'rgba(45, 27, 105, 0.55)',
    border: 'rgba(255, 113, 206, 0.4)',
    glow: '0 0 30px rgba(255, 113, 206, 0.5)',
    dark: true,
  },
  bubblegum: {
    name: 'Bubblegum',
    icon: 'icecream',
    bg1: '#fff0f5',
    bg2: '#ffd1dc',
    bg3: '#ffb6c1',
    primary: '#ff1493',
    secondary: '#9370db',
    accent: '#00bfff',
    text: '#4a0e2f',
    surface: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 20, 147, 0.35)',
    glow: '0 0 24px rgba(255, 20, 147, 0.35)',
    dark: false,
  },
  ocean: {
    name: 'Ocean',
    icon: 'water',
    bg1: '#001f3f',
    bg2: '#003459',
    bg3: '#007ea7',
    primary: '#00d9ff',
    secondary: '#90e0ef',
    accent: '#caf0f8',
    text: '#f1faff',
    surface: 'rgba(0, 31, 63, 0.6)',
    border: 'rgba(0, 217, 255, 0.35)',
    glow: '0 0 24px rgba(0, 217, 255, 0.45)',
    dark: true,
  },
}

export const LAYOUT_MODES = [
  { value: 'glass', label: 'Glass', icon: 'blur_on', desc: 'Frosted, blurry, modern' },
  { value: 'brutal', label: 'Brutal', icon: 'crop_square', desc: 'Hard edges, thick borders' },
  { value: 'soft', label: 'Soft', icon: 'cloud', desc: 'Neumorphic pillows' },
  { value: 'minimal', label: 'Minimal', icon: 'remove', desc: 'Clean & flat' },
  { value: 'retro', label: 'Retro', icon: 'terminal', desc: 'Terminal scanlines' },
]

const STORAGE_KEY = 'timely-theme-v1'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* noop */ }
  return {
    presetKey: 'light', overrides: {},
    animatedBg: true, glass: true, radius: 16, font: 'Inter',
    bgImage: '',
    layoutMode: 'glass', density: 'cozy', weekStart: 'mo', showWeekNumbers: true,
    iconStyle: 'auto',
  }
}

export const useThemeStore = defineStore('themeStore', () => {
  const initial = loadInitial()
  const presetKey = ref(initial.presetKey)
  const overrides = ref(initial.overrides || {})
  const animatedBg = ref(initial.animatedBg ?? true)
  const glass = ref(initial.glass ?? true)
  const radius = ref(initial.radius ?? 16)
  const font = ref(initial.font ?? 'Inter')
  const layoutMode = ref(initial.layoutMode ?? 'glass')
  const density = ref(initial.density ?? 'cozy')
  const weekStart = ref(initial.weekStart ?? 'mo')
  const showWeekNumbers = ref(initial.showWeekNumbers ?? true)
  const iconStyle = ref(initial.iconStyle ?? 'auto')
  const bgImage = ref(initial.bgImage ?? '')

  const theme = computed(() => ({
    ...THEME_PRESETS[presetKey.value],
    ...overrides.value,
  }))

  function applyToDocument() {
    const t = theme.value
    const r = document.documentElement
    r.style.setProperty('--t-bg1', t.bg1)
    r.style.setProperty('--t-bg2', t.bg2)
    r.style.setProperty('--t-bg3', t.bg3)
    r.style.setProperty('--t-primary', t.primary)
    r.style.setProperty('--t-secondary', t.secondary)
    r.style.setProperty('--t-accent', t.accent)
    r.style.setProperty('--t-text', t.text)
    r.style.setProperty('--t-surface', t.surface)
    r.style.setProperty('--t-border', t.border)
    r.style.setProperty('--t-glow', t.glow)
    r.style.setProperty('--t-radius', radius.value + 'px')
    r.style.setProperty('--t-font', font.value)
    r.dataset.animated = animatedBg.value ? '1' : '0'
    r.dataset.glass = glass.value ? '1' : '0'
    r.dataset.dark = t.dark ? '1' : '0'
    r.dataset.preset = presetKey.value
    r.dataset.layout = layoutMode.value
    r.dataset.density = density.value
    // auto = filled on light bg (heavier), outlined on dark bg (lighter)
    const resolvedIcon = iconStyle.value === 'auto'
      ? (t.dark ? 'outlined' : 'filled')
      : iconStyle.value
    r.dataset.icons = resolvedIcon
    if (bgImage.value) {
      r.style.setProperty('--t-bg-image', `url("${bgImage.value}")`)
      r.dataset.bgimage = '1'
    } else {
      r.style.removeProperty('--t-bg-image')
      r.dataset.bgimage = '0'
    }
  }

  function setBgImage(dataUrl) {
    bgImage.value = dataUrl || ''
  }

  function setPreset(key) {
    presetKey.value = key
    overrides.value = {}
  }

  function setOverride(field, value) {
    overrides.value = { ...overrides.value, [field]: value }
  }

  function reset() {
    overrides.value = {}
    animatedBg.value = true
    glass.value = true
    radius.value = 16
    font.value = 'Inter'
    layoutMode.value = 'glass'
    density.value = 'cozy'
    applyToDocument()
  }

  watch(
    [presetKey, overrides, animatedBg, glass, radius, font, layoutMode, density, weekStart, showWeekNumbers, iconStyle, bgImage],
    () => {
      applyToDocument()
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            presetKey: presetKey.value,
            overrides: overrides.value,
            animatedBg: animatedBg.value,
            glass: glass.value,
            radius: radius.value,
            font: font.value,
            layoutMode: layoutMode.value,
            density: density.value,
            weekStart: weekStart.value,
            showWeekNumbers: showWeekNumbers.value,
            iconStyle: iconStyle.value,
            bgImage: bgImage.value,
          }),
        )
      } catch { /* noop */ }
    },
    { deep: true, immediate: false },
  )

  return {
    presetKey,
    overrides,
    animatedBg,
    glass,
    radius,
    font,
    layoutMode,
    density,
    weekStart,
    showWeekNumbers,
    iconStyle,
    bgImage,
    theme,
    setPreset,
    setOverride,
    setBgImage,
    reset,
    applyToDocument,
  }
})
