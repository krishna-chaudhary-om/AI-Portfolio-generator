import { createContext, useContext, useReducer, useCallback } from 'react'
import { DEFAULT_THEME, DEFAULT_LAYOUT, DEFAULT_TONE } from '../styles/themes.js'

// ─── State Shape ──────────────────────────────────────────────────────────────
const initialState = {
  // Upload state
  uploadedFile: null,
  uploadProgress: 0,
  isUploading: false,

  // Generation state
  isGenerating: false,
  generationStep: null,   // 'parsing' | 'extracting' | 'formatting' | 'done'
  generationProgress: 0,
  error: null,

  // Portfolio data
  portfolioData: null,    // structured JSON from AI
  rawText: null,          // extracted text from PDF

  // Customization
  selectedTheme: DEFAULT_THEME,
  selectedLayout: DEFAULT_LAYOUT,
  selectedTone: DEFAULT_TONE,

  // UI state
  activeSection: null,    // which section is being edited
  isEditing: false,
  isSidebarOpen: true,
}

// ─── Actions ──────────────────────────────────────────────────────────────────
const ACTIONS = {
  SET_FILE:             'SET_FILE',
  SET_UPLOAD_PROGRESS:  'SET_UPLOAD_PROGRESS',
  SET_UPLOADING:        'SET_UPLOADING',
  SET_GENERATING:       'SET_GENERATING',
  SET_GENERATION_STEP:  'SET_GENERATION_STEP',
  SET_GENERATION_PROGRESS: 'SET_GENERATION_PROGRESS',
  SET_ERROR:            'SET_ERROR',
  SET_PORTFOLIO_DATA:   'SET_PORTFOLIO_DATA',
  SET_RAW_TEXT:         'SET_RAW_TEXT',
  UPDATE_SECTION:       'UPDATE_SECTION',
  SET_THEME:            'SET_THEME',
  SET_LAYOUT:           'SET_LAYOUT',
  SET_TONE:             'SET_TONE',
  SET_ACTIVE_SECTION:   'SET_ACTIVE_SECTION',
  SET_EDITING:          'SET_EDITING',
  TOGGLE_SIDEBAR:       'TOGGLE_SIDEBAR',
  RESET:                'RESET',
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function portfolioReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_FILE:
      return { ...state, uploadedFile: action.payload, error: null }
    case ACTIONS.SET_UPLOAD_PROGRESS:
      return { ...state, uploadProgress: action.payload }
    case ACTIONS.SET_UPLOADING:
      return { ...state, isUploading: action.payload }
    case ACTIONS.SET_GENERATING:
      return { ...state, isGenerating: action.payload }
    case ACTIONS.SET_GENERATION_STEP:
      return { ...state, generationStep: action.payload }
    case ACTIONS.SET_GENERATION_PROGRESS:
      return { ...state, generationProgress: action.payload }
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isGenerating: false, isUploading: false }
    case ACTIONS.SET_PORTFOLIO_DATA:
      return { ...state, portfolioData: action.payload, isGenerating: false, generationStep: 'done' }
    case ACTIONS.SET_RAW_TEXT:
      return { ...state, rawText: action.payload }
    case ACTIONS.UPDATE_SECTION:
      return {
        ...state,
        portfolioData: {
          ...state.portfolioData,
          [action.payload.section]: action.payload.data,
        },
      }
    case ACTIONS.SET_THEME:
      return { ...state, selectedTheme: action.payload }
    case ACTIONS.SET_LAYOUT:
      return { ...state, selectedLayout: action.payload }
    case ACTIONS.SET_TONE:
      return { ...state, selectedTone: action.payload }
    case ACTIONS.SET_ACTIVE_SECTION:
      return { ...state, activeSection: action.payload }
    case ACTIONS.SET_EDITING:
      return { ...state, isEditing: action.payload }
    case ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, isSidebarOpen: !state.isSidebarOpen }
    case ACTIONS.RESET:
      return { ...initialState }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const PortfolioContext = createContext(null)

export function PortfolioProvider({ children }) {
  const [state, dispatch] = useReducer(portfolioReducer, initialState)

  const setFile          = useCallback((file)     => dispatch({ type: ACTIONS.SET_FILE, payload: file }), [])
  const setUploadProgress= useCallback((p)        => dispatch({ type: ACTIONS.SET_UPLOAD_PROGRESS, payload: p }), [])
  const setUploading     = useCallback((v)        => dispatch({ type: ACTIONS.SET_UPLOADING, payload: v }), [])
  const setGenerating    = useCallback((v)        => dispatch({ type: ACTIONS.SET_GENERATING, payload: v }), [])
  const setGenerationStep= useCallback((step)     => dispatch({ type: ACTIONS.SET_GENERATION_STEP, payload: step }), [])
  const setGenerationProgress = useCallback((p)  => dispatch({ type: ACTIONS.SET_GENERATION_PROGRESS, payload: p }), [])
  const setError         = useCallback((err)      => dispatch({ type: ACTIONS.SET_ERROR, payload: err instanceof Error ? err.message : String(err || 'Unknown error') }), [])
  const setPortfolioData = useCallback((data)     => dispatch({ type: ACTIONS.SET_PORTFOLIO_DATA, payload: data }), [])
  const setRawText       = useCallback((text)     => dispatch({ type: ACTIONS.SET_RAW_TEXT, payload: text }), [])
  const updateSection    = useCallback((section, data) => dispatch({ type: ACTIONS.UPDATE_SECTION, payload: { section, data } }), [])
  const setTheme         = useCallback((theme)    => dispatch({ type: ACTIONS.SET_THEME, payload: theme }), [])
  const setLayout        = useCallback((layout)   => dispatch({ type: ACTIONS.SET_LAYOUT, payload: layout }), [])
  const setTone          = useCallback((tone)     => dispatch({ type: ACTIONS.SET_TONE, payload: tone }), [])
  const setActiveSection = useCallback((sec)      => dispatch({ type: ACTIONS.SET_ACTIVE_SECTION, payload: sec }), [])
  const setEditing       = useCallback((v)        => dispatch({ type: ACTIONS.SET_EDITING, payload: v }), [])
  const toggleSidebar    = useCallback(()         => dispatch({ type: ACTIONS.TOGGLE_SIDEBAR }), [])
  const reset            = useCallback(()         => dispatch({ type: ACTIONS.RESET }), [])

  const value = {
    ...state,
    // actions
    setFile, setUploadProgress, setUploading,
    setGenerating, setGenerationStep, setGenerationProgress,
    setError, setPortfolioData, setRawText,
    updateSection, setTheme, setLayout, setTone,
    setActiveSection, setEditing, toggleSidebar, reset,
  }

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}

export { ACTIONS }