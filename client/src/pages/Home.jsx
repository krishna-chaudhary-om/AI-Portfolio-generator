import { useState } from 'react'
import { usePortfolio } from '../context/PortfolioContext.jsx'
import DropZone from '../components/upload/DropZone.jsx'
import GenerationLoader from '../components/upload/GenerationLoader.jsx'
import CustomizationPanel from '../components/upload/CustomizationPanel.jsx'
import Button from '../components/common/Button.jsx'
import { useUpload } from '../hooks/useUpload.js'
import { Zap, Code2, Palette, Download, FileText, ClipboardPaste } from 'lucide-react'
import styles from './Home.module.css'

export default function Home() {
  const { isUploading, isGenerating, uploadedFile } = usePortfolio()
  const { processFile, processText } = useUpload()
  const isProcessing = isUploading || isGenerating

  const [activeTab, setActiveTab] = useState('file') // 'file' | 'text'
  const [pastedText, setPastedText] = useState('')

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          AI-Powered Resume → Portfolio
        </div>
        <h1 className={styles.heroTitle}>
          Your resume deserves<br />
          <span className={styles.heroAccent}>a real website.</span>
        </h1>
        <p className={styles.heroSub}>
          Upload your PDF resume and get a stunning, customizable portfolio website in seconds — powered by AI.
        </p>
        <div className={styles.heroFeatures}>
          {[
            { icon: <Zap size={14} />,      label: 'Instant generation' },
            { icon: <Code2 size={14} />,    label: 'Clean HTML export' },
            { icon: <Palette size={14} />,  label: '5 themes & layouts' },
            { icon: <Download size={14} />, label: 'One-click download' },
          ].map(({ icon, label }) => (
            <span key={label} className={styles.featureChip}>
              {icon} {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Main content ── */}
      <section className={styles.main}>
        <div className={styles.uploadColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Upload Resume</h2>
              <span className={styles.cardStep}>Step 1 of 2</span>
            </div>

            {isProcessing ? (
              <GenerationLoader />
            ) : (
              <>
                {/* ── Tabs ── */}
                <div className={styles.tabs}>
                  <button
                    className={[styles.tab, activeTab === 'file' ? styles.tabActive : ''].join(' ')}
                    onClick={() => setActiveTab('file')}
                  >
                    <FileText size={14} /> Upload PDF
                  </button>
                  <button
                    className={[styles.tab, activeTab === 'text' ? styles.tabActive : ''].join(' ')}
                    onClick={() => setActiveTab('text')}
                  >
                    <ClipboardPaste size={14} /> Paste Text
                  </button>
                </div>

                {activeTab === 'file' ? (
                  <>
                    <DropZone />
                    {uploadedFile && (
                      <Button
                        fullWidth
                        size="lg"
                        onClick={() => processFile(uploadedFile)}
                        icon={<Zap size={16} />}
                      >
                        Generate Portfolio
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <textarea
                      className={styles.pasteArea}
                      placeholder="Paste your resume text here…"
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      rows={12}
                    />
                    {pastedText.trim().length > 50 && (
                      <Button
                        fullWidth
                        size="lg"
                        onClick={() => processText(pastedText)}
                        icon={<Zap size={16} />}
                      >
                        Generate Portfolio
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className={styles.customizeColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Customize</h2>
              <span className={styles.cardStep}>Step 2 of 2</span>
            </div>
            <CustomizationPanel />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.howItWorks}>
        <h3 className={styles.howTitle}>How it works</h3>
        <div className={styles.steps}>
          {[
            { n: '01', title: 'Upload PDF',    desc: 'Drop your resume and we extract every detail automatically.' },
            { n: '02', title: 'AI Structures', desc: 'Claude & GPT-4 organize your experience into portfolio sections.' },
            { n: '03', title: 'Customize',     desc: 'Pick a theme, layout, and writing tone that fits your brand.' },
            { n: '04', title: 'Export & Ship', desc: 'Download a self-contained HTML site, ready to deploy anywhere.' },
          ].map((step) => (
            <div key={step.n} className={styles.step}>
              <span className={styles.stepNum}>{step.n}</span>
              <h4 className={styles.stepTitle}>{step.title}</h4>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}