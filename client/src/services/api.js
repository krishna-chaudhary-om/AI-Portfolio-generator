import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// ─── Axios instance ────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120_000, // 2 min for AI ops
})

// Request interceptor — attach auth if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — normalize errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // Safely extract message — never access nested props without checks
    let message = 'Something went wrong'
    try {
      const data = err?.response?.data
      if (typeof data === 'string' && data.length < 300) {
        message = data
      } else if (data && typeof data === 'object') {
        message = data.message || data.error || message
      } else if (err?.message) {
        message = err.message
      }
    } catch {
      // fallback already set above
    }
    return Promise.reject(new Error(message))
  }
)

// ─── Resume endpoints ──────────────────────────────────────────────────────

/**
 * Upload resume PDF + generate portfolio
 * @param {File} file
 * @param {{ theme, layout, tone }} options
 * @param {(progress: number) => void} onProgress
 * @returns {Promise<PortfolioData>}
 */
export async function uploadAndGenerate(file, options = {}, onProgress) {
  const formData = new FormData()
  formData.append('resume', file)
  formData.append('theme', options.theme || 'midnight')
  formData.append('layout', options.layout || 'classic')
  formData.append('tone', options.tone || 'professional')

  return api.post('/resume/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total))
      }
    },
  })
}

/**
 * Regenerate a specific section with new tone
 * @param {{ section, content, tone }} payload
 */
export async function regenerateSection(payload) {
  return api.post('/resume/regenerate-section', payload)
}

/**
 * Export portfolio as standalone HTML
 * @param {{ portfolioData, theme, layout }} payload
 * @returns {Promise<{ html: string }>}
 */
export async function exportPortfolio(payload) {
  return api.post('/resume/export', payload)
}

/**
 * Get generation status (for polling if using async queue)
 * @param {string} jobId
 */
export async function getGenerationStatus(jobId) {
  return api.get(`/resume/status/${jobId}`)
}

// ─── Mock (dev-only fallback) ──────────────────────────────────────────────
export const MOCK_PORTFOLIO = {
  name: 'Arjun Sharma',
  title: 'Full-Stack Developer & UI Engineer',
  tagline: 'Building products at the intersection of design and engineering.',
  email: 'arjun.sharma@email.com',
  phone: '+91 98765 43210',
  location: 'Bangalore, India',
  linkedin: 'linkedin.com/in/arjunsharma',
  github: 'github.com/arjunsharma',
  website: 'arjunsharma.dev',
  summary:
    'Passionate developer with 3+ years of experience building scalable web apps. I love clean code, thoughtful UX, and shipping things that matter.',
  skills: {
    Frontend: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    Backend:  ['Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'GraphQL'],
    DevOps:   ['Docker', 'AWS', 'GitHub Actions', 'Vercel'],
    Other:    ['System Design', 'Agile', 'Figma', 'Open Source'],
  },
  experience: [
    {
      company: 'Razorpay',
      role: 'Software Engineer II',
      period: 'Jan 2023 – Present',
      location: 'Bangalore',
      bullets: [
        'Rebuilt the payment checkout flow, cutting drop-off rates by 18%',
        'Led migration of legacy jQuery codebase to React 18, reducing bundle size 40%',
        'Mentored 3 junior engineers across frontend best practices',
      ],
    },
    {
      company: 'Groww',
      role: 'Frontend Engineer',
      period: 'Jul 2021 – Dec 2022',
      location: 'Remote',
      bullets: [
        'Built real-time stock ticker component serving 2M+ daily users',
        'Implemented WebSocket data streaming with optimistic UI updates',
        'Collaborated with design team to ship accessible component library',
      ],
    },
  ],
  projects: [
    {
      name: 'AI Portfolio Generator',
      description: 'Resume-to-portfolio tool powered by OpenAI and Claude APIs.',
      tech: ['React', 'Node.js', 'OpenAI', 'Claude'],
      link: 'github.com/arjunsharma/portfolio-gen',
      highlights: ['1.2k GitHub stars', '500+ portfolios generated'],
    },
    {
      name: 'DevPulse',
      description: 'Real-time developer productivity dashboard with GitHub insights.',
      tech: ['Next.js', 'GraphQL', 'PostgreSQL', 'D3.js'],
      link: 'devpulse.app',
      highlights: ['Featured on Product Hunt', '300 active users'],
    },
    {
      name: 'Logcraft',
      description: 'Structured logging library for Node.js microservices.',
      tech: ['TypeScript', 'Node.js'],
      link: 'npmjs.com/package/logcraft',
      highlights: ['12k weekly npm downloads'],
    },
  ],
  education: [
    {
      institution: 'IIT Roorkee',
      degree: 'B.Tech Computer Science',
      period: '2017 – 2021',
      gpa: '8.7/10',
      highlights: ['Dean\'s List 3 semesters', 'ACM ICPC Regionalist'],
    },
  ],
  certifications: [
    { name: 'AWS Solutions Architect – Associate', issuer: 'Amazon', year: '2023' },
    { name: 'Google Cloud Professional Developer', issuer: 'Google', year: '2022' },
  ],
  languages: ['Hindi (Native)', 'English (Fluent)'],
}