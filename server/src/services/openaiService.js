import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash' });

const SYSTEM_PROMPT = `You are an expert career coach and portfolio writer.
Transform resume text into HIGHLY SPECIFIC, personalized portfolio content.

CRITICAL RULES:
- NEVER use placeholder names like "John Doe" or "Arjun Sharma"
- ALWAYS extract the REAL name from resume
- If name not found, return "Unknown Candidate"
- Output MUST be unique to the input resume

Return ONLY valid JSON. No markdown. No explanation. No code fences.`;

export async function generatePortfolioContent(resumeText, options = {}) {
  const { tone = 'professional' } = options;

  if (!resumeText || resumeText.trim().length < 50) {
    logger.error('Resume text is empty or too short');
    throw new Error('Resume parsing failed. Please upload a proper PDF.');
  }

  logger.info(`Resume length: ${resumeText.length}`);
  logger.info(`Resume preview: ${resumeText.slice(0, 300)}`);

  const userPrompt = buildPrompt(resumeText, tone);
  const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;

  logger.info('Sending resume to Gemini...');
  const startTime = Date.now();

  let raw;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    raw = response.text();
  } catch (err) {
    logger.error('Gemini API Error:', err.message);
    throw new Error('AI service failed. Check API key or quota.');
  }

  const elapsed = Date.now() - startTime;
  logger.info(`Gemini responded in ${elapsed}ms`);

  if (!raw) {
    logger.error('Empty response from Gemini');
    throw new Error('AI returned empty response.');
  }

  logger.info('RAW AI OUTPUT (first 500 chars):');
  logger.info(raw.slice(0, 500));

  try {
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const content = JSON.parse(cleaned);
    validateContent(content);

    if (!content.hero?.name || content.hero.name.toLowerCase().includes('arjun')) {
      logger.warn('Detected generic AI output - possible bad input');
    }

    return content;
  } catch (err) {
    logger.error('Failed to parse AI response:', raw);
    throw new Error('AI returned invalid JSON.');
  }
}

function buildPrompt(resumeText, tone) {
  const toneGuide = {
    professional: 'Use formal, confident, business language.',
    casual: 'Use friendly, conversational language.',
    bold: 'Use punchy, high-impact language.',
  }[tone] || 'Use professional language.';

  return `
You are given a REAL resume. Extract REAL information.

${toneGuide}

RESUME TEXT:
---
${resumeText.slice(0, 12000)}
---

STRICT INSTRUCTIONS:
- DO NOT invent fake names
- DO NOT use placeholders
- Use ONLY information from resume
- If something is missing, return null

Return JSON:

{
  "hero": {
    "name": "",
    "tagline": "",
    "bio": "",
    "email": null,
    "phone": null,
    "location": null,
    "linkedin": null,
    "github": null,
    "website": null
  },
  "skills": {
    "technical": [],
    "soft": [],
    "languages": []
  },
  "experience": [],
  "projects": [],
  "education": []
}
`;
}

function validateContent(content) {
  const required = ['hero', 'skills', 'experience', 'projects', 'education'];
  for (const key of required) {
    if (!content[key]) {
      throw new Error(`Missing required field: ${key}`);
    }
  }
}