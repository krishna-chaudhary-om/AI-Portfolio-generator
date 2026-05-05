import { useEffect, useState } from 'react'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
import styles from './GenerationLoader.module.css'

const STEP_LABELS = {
  parsing:    'Parsing your resume',
  extracting: 'Extracting key information',
  formatting: 'AI crafting your content',
  polishing:  'Polishing the portfolio',
  done:       'Portfolio ready!',
}

const STEP_ORDER = ['parsing', 'extracting', 'formatting', 'polishing', 'done']

export default function GenerationLoader() {
  const { generationStep, generationProgress, isUploading, uploadProgress } = usePortfolio()
  const [dots, setDots] = useState('')

  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? '' : d + '.')), 400)
    return () => clearInterval(id)
  }, [])

  const currentStep = isUploading ? null : generationStep
  const progress    = isUploading ? uploadProgress : generationProgress
  const label       = isUploading
    ? 'Uploading resume'
    : STEP_LABELS[currentStep] || 'Processing'

  return (
    <div className={styles.wrapper}>
      <div className={styles.animWrapper}>
        <OrbitSpinner />
      </div>

      <div className={styles.info}>
        <p className={styles.label}>
          {label}
          <span className={styles.dots}>{dots}</span>
        </p>
        <ProgressBar value={progress} showPercent />
      </div>

      {!isUploading && (
        <div className={styles.steps}>
          {STEP_ORDER.filter((s) => s !== 'done').map((step, i) => {
            const stepIdx    = STEP_ORDER.indexOf(currentStep)
            const thisIdx    = STEP_ORDER.indexOf(step)
            const isComplete = thisIdx < stepIdx
            const isActive   = step === currentStep

            return (
              <div
                key={step}
                className={[
                  styles.step,
                  isComplete ? styles.complete : '',
                  isActive   ? styles.active   : '',
                ].join(' ')}
              >
                <div className={styles.stepDot}>
                  {isComplete && <CheckIcon />}
                  {isActive && <span className={styles.activePulse} />}
                </div>
                <span className={styles.stepLabel}>{STEP_LABELS[step]}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function OrbitSpinner() {
  return (
    <div className={styles.orbit}>
      <div className={styles.orbitRing1} />
      <div className={styles.orbitRing2} />
      <div className={styles.orbitCore} />
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
