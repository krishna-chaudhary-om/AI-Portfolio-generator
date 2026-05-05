import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { logger } from '../utils/logger.js';

/**
 * Extract raw text from resume
 */
export async function extractTextFromResume(buffer, mimetype) {
  try {
    let text = '';

    if (mimetype === 'application/pdf') {
      text = await extractFromPDF(buffer);
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      text = await extractFromDOCX(buffer);
    } else {
      throw new Error(`Unsupported file type: ${mimetype}`);
    }

    // 🔥 CLEAN + NORMALIZE TEXT
    text = cleanText(text);

    // 🔥 FINAL VALIDATION
    if (!text || text.length < 100) {
      logger.error('❌ Extracted text too short or invalid');
      throw new Error('Resume content is too weak or unreadable.');
    }

    logger.info(`✅ Final cleaned text length: ${text.length}`);
    logger.info(`📄 Preview: ${text.slice(0, 300)}`);

    return text;

  } catch (err) {
    logger.error('❌ Resume extraction error:', err);
    throw new Error(`Could not parse resume: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────

async function extractFromPDF(buffer) {
  const data = await pdfParse(buffer);

  let text = data.text;

  if (!text || text.trim().length === 0) {
    throw new Error('PDF appears to be empty or image-based (scanned)');
  }

  logger.info(`📄 PDF parsed: ${data.numpages} pages`);
  return text;
}

// ─────────────────────────────────────────────────────────────

async function extractFromDOCX(buffer) {
  const result = await mammoth.extractRawText({ buffer });

  let text = result.value;

  if (result.messages.length) {
    logger.warn('⚠️ DOCX parse warnings:', result.messages);
  }

  if (!text || text.trim().length === 0) {
    throw new Error('DOCX appears to be empty');
  }

  logger.info(`📄 DOCX parsed: ${text.length} chars`);
  return text;
}

// ─────────────────────────────────────────────────────────────

// 🔥 CLEANING FUNCTION (CRITICAL)
function cleanText(text) {
  return text
    .replace(/\r/g, '\n')                // normalize line breaks
    .replace(/\n{2,}/g, '\n')           // remove extra blank lines
    .replace(/[ \t]{2,}/g, ' ')         // remove extra spaces
    .replace(/•/g, '-')                 // normalize bullets
    .replace(/[^\x00-\x7F]/g, '')       // remove weird unicode
    .trim();
}