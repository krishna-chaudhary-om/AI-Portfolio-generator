import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, ClipboardPaste } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { useUpload } from '../../hooks/useUpload.js'
import { formatFileSize } from '../../utils/helpers.js'
import styles from './DropZone.module.css'

export default function DropZone() {
  const { uploadedFile, isUploading, isGenerating, setRawText, rawText } = usePortfolio()
  const { processFile } = useUpload()
  const [dragError, setDragError] = useState(null)
  const [tab, setTab] = useState('file') // 'file' | 'paste'
  const [pasteValue, setPasteValue] = useState('')

  const onDrop = useCallback(
    (accepted, rejected) => {
      setDragError(null)
      if (rejected.length > 0) {
        const err = rejected[0].errors[0]
        if (err.code === 'file-too-large') setDragError('File exceeds 10MB limit.')
        else if (err.code === 'file-invalid-type') setDragError('Only PDF files are accepted.')
        else setDragError(err.message)
        return
      }
      if (accepted[0]) processFile(accepted[0])
    },
    [processFile]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
    disabled: isUploading || isGenerating || tab === 'paste',
  })

  const isLocked = isUploading || isGenerating

  const handlePasteChange = (e) => {
    const val = e.target.value
    setPasteValue(val)
    setRawText(val.trim() || null)
  }

  return (
    <div className={styles.wrapper}>
      {/* Tab switcher */}
      <div className={styles.tabs}>
        <button
          className={[styles.tab, tab === 'file' ? styles.tabActive : ''].join(' ')}
          onClick={() => setTab('file')}
          type="button"
        >
          <Upload size={13} /> Upload PDF
        </button>
        <button
          className={[styles.tab, tab === 'paste' ? styles.tabActive : ''].join(' ')}
          onClick={() => setTab('paste')}
          type="button"
        >
          <ClipboardPaste size={13} /> Paste Text
        </button>
      </div>

      {/* FILE TAB */}
      {tab === 'file' && (
        <>
          <div
            {...getRootProps()}
            className={[
              styles.zone,
              isDragActive && !isDragReject ? styles.active : '',
              isDragReject ? styles.reject : '',
              isLocked ? styles.locked : '',
              uploadedFile ? styles.hasFile : '',
            ].join(' ')}
          >
            <input {...getInputProps()} />
            <div className={styles.inner}>
              {uploadedFile ? (
                <FilePreview file={uploadedFile} />
              ) : (
                <EmptyState isDragActive={isDragActive} isDragReject={isDragReject} />
              )}
            </div>
          </div>

          {dragError && (
            <div className={styles.error}>
              <AlertCircle size={14} />
              <span>{dragError}</span>
            </div>
          )}

          <p className={styles.hint}>
            Supported format: <strong>PDF</strong> · Max size: <strong>10MB</strong>
          </p>
        </>
      )}

      {/* PASTE TAB */}
      {tab === 'paste' && (
        <div className={styles.pasteWrap}>
          <textarea
            className={styles.pasteArea}
            placeholder={
              'Paste your resume text here...\n\nInclude everything — name, contact info, education, work experience, projects, skills.\nThe more detail, the better your portfolio.'
            }
            value={pasteValue}
            onChange={handlePasteChange}
            disabled={isLocked}
            rows={12}
            spellCheck={false}
          />
          {pasteValue.trim().length > 0 && (
            <p className={styles.pasteReady}>
              <FileText size={13} />
              {pasteValue.trim().split(/\s+/).length} words detected — ready to generate
            </p>
          )}
          {pasteValue.trim().length === 0 && (
            <p className={styles.hint}>Paste any plain text — Word, Google Docs, or copied from a PDF viewer.</p>
          )}
        </div>
      )}
    </div>
  )
}

function EmptyState({ isDragActive, isDragReject }) {
  return (
    <>
      <div className={styles.iconWrap}>
        {isDragReject ? (
          <AlertCircle size={32} className={styles.iconReject} />
        ) : (
          <Upload size={32} className={isDragActive ? styles.iconActive : styles.iconDefault} />
        )}
      </div>
      <div className={styles.text}>
        {isDragReject ? (
          <p className={styles.rejectText}>Only PDF files are accepted</p>
        ) : isDragActive ? (
          <p className={styles.activeText}>Release to upload your resume</p>
        ) : (
          <>
            <p className={styles.mainText}>
              Drag & drop your resume <span className={styles.or}>or</span>{' '}
              <span className={styles.browse}>click to browse</span>
            </p>
            <p className={styles.subText}>Your PDF will be processed securely</p>
          </>
        )}
      </div>
      <div className={styles.dashes} />
    </>
  )
}

function FilePreview({ file }) {
  return (
    <div className={styles.filePreview}>
      <div className={styles.fileIcon}>
        <FileText size={24} />
        <span className={styles.fileBadge}>PDF</span>
      </div>
      <div className={styles.fileMeta}>
        <span className={styles.fileName}>{file.name}</span>
        <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
      </div>
      <div className={styles.fileReady}>Ready to generate</div>
    </div>
  )
}