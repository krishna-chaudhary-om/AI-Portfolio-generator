import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings2, Download, Eye, Code, ArrowLeft, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { usePortfolio } from '../context/PortfolioContext.jsx'
import PortfolioRenderer from '../components/portfolio/PortfolioRenderer.jsx'
import EditPanel from '../components/portfolio/EditPanel.jsx'
import Button from '../components/common/Button.jsx'
import { generatePortfolioHTML } from '../utils/helpers.js'
import styles from './Preview.module.css'

export default function Preview() {
  const navigate = useNavigate()
  const { portfolioData, selectedTheme, selectedLayout, reset } = usePortfolio()
  const [editPanelOpen, setEditPanelOpen]   = useState(false)
  const [viewMode, setViewMode]             = useState('preview') // 'preview' | 'code'
  const [copied, setCopied]                 = useState(false)
  const [device, setDevice]                 = useState('desktop') // 'desktop' | 'mobile'
  const previewRef                          = useRef(null)

  // Redirect if no data
  if (!portfolioData) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>No portfolio generated yet.</p>
        <Button onClick={() => navigate('/')} icon={<ArrowLeft size={15} />}>
          Go back
        </Button>
      </div>
    )
  }

  const htmlString = generatePortfolioHTML(portfolioData, selectedTheme, selectedLayout)

  function handleExport() {
    const blob = new Blob([htmlString], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${(portfolioData.name || 'portfolio').toLowerCase().replace(/\s+/g, '-')}-portfolio.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Portfolio downloaded!')
  }

  async function handleCopyCode() {
    await navigator.clipboard.writeText(htmlString)
    setCopied(true)
    toast.success('HTML copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.page}>

      {/* ── Top toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button className={styles.backBtn} onClick={() => { reset(); navigate('/') }}>
            <ArrowLeft size={15} />
            New resume
          </button>
          <div className={styles.divider} />
          <span className={styles.toolbarName}>{portfolioData.name}</span>
        </div>

        <div className={styles.toolbarCenter}>
          <div className={styles.viewToggle}>
            <button
              className={[styles.toggleBtn, viewMode === 'preview' ? styles.toggleActive : ''].join(' ')}
              onClick={() => setViewMode('preview')}
            >
              <Eye size={13} /> Preview
            </button>
            <button
              className={[styles.toggleBtn, viewMode === 'code' ? styles.toggleActive : ''].join(' ')}
              onClick={() => setViewMode('code')}
            >
              <Code size={13} /> HTML
            </button>
          </div>

          {viewMode === 'preview' && (
            <div className={styles.deviceToggle}>
              {['desktop', 'mobile'].map((d) => (
                <button
                  key={d}
                  className={[styles.deviceBtn, device === d ? styles.deviceActive : ''].join(' ')}
                  onClick={() => setDevice(d)}
                  title={d.charAt(0).toUpperCase() + d.slice(1)}
                >
                  {d === 'desktop' ? '🖥' : '📱'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.toolbarRight}>
          {viewMode === 'code' && (
            <Button
              variant="secondary"
              size="sm"
              icon={copied ? <Check size={13} /> : <Copy size={13} />}
              onClick={handleCopyCode}
            >
              {copied ? 'Copied!' : 'Copy HTML'}
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={<Settings2 size={14} />}
            onClick={() => setEditPanelOpen((o) => !o)}
          >
            Customize
          </Button>
          <Button
            size="sm"
            icon={<Download size={14} />}
            onClick={handleExport}
            data-export-btn
          >
            Export Site
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>

        {/* ── Preview / Code area ── */}
        <div className={styles.canvasWrap}>
          {viewMode === 'preview' ? (
            <div
              className={[
                styles.previewFrame,
                device === 'mobile' ? styles.mobileFrame : '',
              ].join(' ')}
            >
              <div ref={previewRef} className={styles.previewInner}>
                <PortfolioRenderer />
              </div>
            </div>
          ) : (
            <div className={styles.codeView}>
              <div className={styles.codeHeader}>
                <span className={styles.codeFilename}>portfolio.html</span>
                <span className={styles.codeLines}>{htmlString.split('\n').length} lines</span>
              </div>
              <pre className={styles.codePre}>
                <code>{htmlString}</code>
              </pre>
            </div>
          )}
        </div>

        {/* ── Edit panel ── */}
        {editPanelOpen && (
          <EditPanel onClose={() => setEditPanelOpen(false)} />
        )}
      </div>

      {/* ── Bottom stats bar ── */}
      <div className={styles.statsBar}>
        <StatItem label="Sections" value={countSections(portfolioData)} />
        <StatItem label="Skills" value={countSkills(portfolioData)} />
        <StatItem label="Projects" value={portfolioData.projects?.length ?? 0} />
        <StatItem label="Experience" value={portfolioData.experience?.length ?? 0} />
        <StatItem label="Theme" value={selectedTheme} capitalize />
        <StatItem label="Layout" value={selectedLayout} capitalize />
      </div>

    </div>
  )
}

/* ── Helpers ── */
function StatItem({ label, value, capitalize }) {
  return (
    <div className={styles.statItem}>
      <span className={styles.statLabel}>{label}</span>
      <span className={[styles.statValue, capitalize ? styles.capitalize : ''].join(' ')}>
        {value}
      </span>
    </div>
  )
}

function countSections(data) {
  const keys = ['experience', 'projects', 'education', 'skills', 'certifications']
  return keys.filter((k) => data[k] && (Array.isArray(data[k]) ? data[k].length > 0 : true)).length
}

function countSkills(data) {
  if (!data.skills) return 0
  if (Array.isArray(data.skills)) return data.skills.length
  return Object.values(data.skills).flat().length
}
