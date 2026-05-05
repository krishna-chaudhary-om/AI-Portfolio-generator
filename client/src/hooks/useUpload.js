import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { usePortfolio } from '../context/PortfolioContext.jsx'
import { MOCK_PORTFOLIO } from '../services/api.js'

// Set VITE_USE_MOCK=false in .env to use real AI
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const GENERATION_STEPS = [
  { key: 'parsing',    label: 'Parsing your resume…',        duration: 800  },
  { key: 'extracting', label: 'Extracting key information…', duration: 1200 },
  { key: 'formatting', label: 'AI formatting your content…', duration: 1500 },
  { key: 'polishing',  label: 'Polishing the portfolio…',    duration: 1000 },
  { key: 'done',       label: 'Portfolio ready!',            duration: 0    },
]

// ─── Direct AI call (no backend needed) ───────────────────────────────────────
function buildPrompt(resumeText, tone) {
  return `You are a portfolio content extractor. Given the resume text below, extract ALL information and return a clean JSON portfolio. Tone: "${tone}".

Resume:
"""
${resumeText}
"""

Return ONLY valid JSON — no markdown fences. Use this exact shape:
{
  "name": "Full Name",
  "title": "Professional Title",
  "tagline": "Compelling 2-3 sentence bio for portfolio hero",
  "email": "", "phone": "", "location": "",
  "linkedin": "", "github": "", "website": "",
  "summary": "2-3 sentence professional summary",
  "skills": { "Frontend": ["skill"], "Backend": ["skill"], "Other": ["skill"] },
  "projects": [
    { "name": "Title", "description": "2-sentence impact description", "tech": ["React"], "link": "", "highlights": [] }
  ],
  "experience": [
    { "company": "Name", "role": "Title", "period": "Jan 2022 – Present", "location": "", "bullets": ["achievement"] }
  ],
  "education": [
    { "institution": "School", "degree": "Degree", "period": "2020–2024", "gpa": "", "highlights": [] }
  ],
  "certifications": [],
  "languages": []
}
Return ONLY the JSON object. Empty string for missing text, empty array for missing lists.`
}

async function callClaudeDirectly(resumeText, tone) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Add VITE_ANTHROPIC_API_KEY to client/.env')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: buildPrompt(resumeText, tone) }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Claude API error ${res.status}`)
  }

  const data = await res.json()
  const raw = data.content.map(c => c.text || '').join('')
  return parseJSON(raw)
}

async function callOpenAIDirectly(resumeText, tone) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) throw new Error('Add VITE_OPENAI_API_KEY to client/.env')

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 2000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Portfolio extractor. Return only valid JSON.' },
        { role: 'user', content: buildPrompt(resumeText, tone) },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `OpenAI error ${res.status}`)
  }

  const data = await res.json()
  return parseJSON(data.choices[0].message.content)
}

async function callGeminiDirectly(resumeText, tone) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('Add VITE_GEMINI_API_KEY to client/.env')

  const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash'

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(resumeText, tone) }] }],
      }),
    }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Gemini error ${res.status}`)
  }

  const data = await res.json()
  const raw = data.candidates[0].content.parts[0].text
  return parseJSON(raw)
}

function parseJSON(raw) {
  const cleaned = raw.replace(/```json|```/g, '').trim()
  try { return JSON.parse(cleaned) }
  catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error('Could not parse AI response — please try again.')
  }
}

async function callAI(resumeText, tone) {
  const provider = import.meta.env.VITE_AI_PROVIDER || 'claude'
  if (provider === 'openai') return callOpenAIDirectly(resumeText, tone)
  if (provider === 'gemini') return callGeminiDirectly(resumeText, tone)
  return callClaudeDirectly(resumeText, tone)
}

// ─── Shared step animator ─────────────────────────────────────────────────────
async function runGenerationSteps(setGenerationStep, setGenerationProgress) {
  let totalProgress = 0
  for (let i = 0; i < GENERATION_STEPS.length - 1; i++) {
    const step = GENERATION_STEPS[i]
    setGenerationStep(step.key)
    const start = totalProgress
    const end = Math.round(((i + 1) / (GENERATION_STEPS.length - 1)) * 100)
    const increment = (end - start) / 20
    for (let j = 0; j < 20; j++) {
      await new Promise(r => setTimeout(r, step.duration / 20))
      setGenerationProgress(Math.min(100, Math.round(start + increment * (j + 1))))
    }
    totalProgress = end
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useUpload() {
  const navigate = useNavigate()
  const {
    setFile, setUploading, setUploadProgress,
    setGenerating, setGenerationStep, setGenerationProgress,
    setPortfolioData, setError,
    selectedTheme, selectedLayout, selectedTone,
  } = usePortfolio()

  // ── PDF file flow ──────────────────────────────────────────────────────────
  const processFile = useCallback(async (file) => {
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max size is 10MB.')
      return
    }
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.')
      return
    }

    setFile(file)
    setUploading(true)
    setUploadProgress(0)

    try {
      if (USE_MOCK) {
        for (let p = 0; p <= 100; p += 20) {
          await new Promise(r => setTimeout(r, 100))
          setUploadProgress(p)
        }
        setUploading(false)
        setGenerating(true)
        await runGenerationSteps(setGenerationStep, setGenerationProgress)
        setPortfolioData(MOCK_PORTFOLIO)
        toast.success('Portfolio generated!')
        navigate('/preview')
        return
      }

      // Extract text from PDF in-browser using pdf.js
      setUploading(false)
      setGenerating(true)

      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString()

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        fullText += content.items.map(item => item.str).join(' ') + '\n'
      }

      if (!fullText.trim()) throw new Error('Could not extract text from PDF. Try pasting your resume text instead.')

      runGenerationSteps(setGenerationStep, setGenerationProgress)
      const portfolio = await callAI(fullText, selectedTone)
      setPortfolioData(portfolio)
      toast.success('Portfolio generated!')
      navigate('/preview')

    } catch (err) {
      setError(err.message)
      toast.error(err.message || 'Failed to generate portfolio')
      setUploading(false)
      setGenerating(false)
    }
  }, [selectedTheme, selectedLayout, selectedTone, navigate])

  // ── Pasted text flow ───────────────────────────────────────────────────────
  const processText = useCallback(async (rawText) => {
    if (!rawText?.trim()) {
      toast.error('Please paste your resume text first.')
      return
    }
    if (rawText.trim().split(/\s+/).length < 30) {
      toast.error('Text seems too short. Paste your full resume.')
      return
    }

    setGenerating(true)
    setGenerationStep('parsing')
    setGenerationProgress(0)

    try {
      if (USE_MOCK) {
        await runGenerationSteps(setGenerationStep, setGenerationProgress)
        setPortfolioData(MOCK_PORTFOLIO)
        toast.success('Portfolio generated!')
        navigate('/preview')
        return
      }

      runGenerationSteps(setGenerationStep, setGenerationProgress)
      const portfolio = await callAI(rawText, selectedTone)
      setPortfolioData(portfolio)
      toast.success('Portfolio generated!')
      navigate('/preview')

    } catch (err) {
      setError(err.message)
      toast.error(err.message || 'Failed to generate portfolio')
      setGenerating(false)
    }
  }, [selectedTone, navigate])

  return { processFile, processText }
}