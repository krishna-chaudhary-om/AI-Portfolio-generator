export const THEMES = {
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark & professional',
    preview: ['#0f0f0f', '#1a1a2e', '#6c63ff'],
    vars: {
      '--pt-bg': '#0f0f0f',
      '--pt-surface': '#1a1a1a',
      '--pt-accent': '#6c63ff',
      '--pt-text': '#f0f0f0',
      '--pt-muted': '#888',
      '--pt-border': '#2a2a2a',
      '--pt-heading-font': '"Syne", sans-serif',
      '--pt-body-font': '"DM Sans", sans-serif',
    },
  },
  ivory: {
    id: 'ivory',
    name: 'Ivory',
    description: 'Clean & minimal',
    preview: ['#fafaf8', '#f0ede8', '#1a1a1a'],
    vars: {
      '--pt-bg': '#fafaf8',
      '--pt-surface': '#f0ede8',
      '--pt-accent': '#1a1a1a',
      '--pt-text': '#1a1a1a',
      '--pt-muted': '#666',
      '--pt-border': '#e0ddd8',
      '--pt-heading-font': '"Syne", sans-serif',
      '--pt-body-font': '"DM Sans", sans-serif',
    },
  },
  ember: {
    id: 'ember',
    name: 'Ember',
    description: 'Warm & bold',
    preview: ['#1a0f00', '#2d1a00', '#f5a623'],
    vars: {
      '--pt-bg': '#1a0f00',
      '--pt-surface': '#2d1a00',
      '--pt-accent': '#f5a623',
      '--pt-text': '#f0ece6',
      '--pt-muted': '#9b9186',
      '--pt-border': '#3a2a10',
      '--pt-heading-font': '"Syne", sans-serif',
      '--pt-body-font': '"DM Sans", sans-serif',
    },
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Nature & calm',
    preview: ['#0d1a0f', '#1a2e1d', '#4ade80'],
    vars: {
      '--pt-bg': '#0d1a0f',
      '--pt-surface': '#1a2e1d',
      '--pt-accent': '#4ade80',
      '--pt-text': '#e8f5ea',
      '--pt-muted': '#7aab80',
      '--pt-border': '#243d27',
      '--pt-heading-font': '"Syne", sans-serif',
      '--pt-body-font': '"DM Sans", sans-serif',
    },
  },
  slate: {
    id: 'slate',
    name: 'Slate',
    description: 'Corporate & sharp',
    preview: ['#0f1520', '#1a2535', '#38bdf8'],
    vars: {
      '--pt-bg': '#0f1520',
      '--pt-surface': '#1a2535',
      '--pt-accent': '#38bdf8',
      '--pt-text': '#e8f0f8',
      '--pt-muted': '#7a9ab0',
      '--pt-border': '#243044',
      '--pt-heading-font': '"Syne", sans-serif',
      '--pt-body-font': '"DM Sans", sans-serif',
    },
  },
}

export const LAYOUTS = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Top nav, sections below',
    icon: '▤',
  },
  sidebar: {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Fixed left panel',
    icon: '▥',
  },
  card: {
    id: 'card',
    name: 'Card Grid',
    description: 'Bento-style cards',
    icon: '▦',
  },
}

export const TONES = {
  professional: {
    id: 'professional',
    label: 'Professional',
    prompt: 'formal, clear, achievement-focused',
  },
  creative: {
    id: 'creative',
    label: 'Creative',
    prompt: 'expressive, narrative, personality-driven',
  },
  minimal: {
    id: 'minimal',
    label: 'Minimal',
    prompt: 'concise, direct, no fluff',
  },
  bold: {
    id: 'bold',
    label: 'Bold',
    prompt: 'confident, impact-first, punchy',
  },
}

export const DEFAULT_THEME = 'midnight'
export const DEFAULT_LAYOUT = 'classic'
export const DEFAULT_TONE = 'professional'
