# AI Portfolio Generator — Server

Node.js + Express backend powering the resume → portfolio pipeline.

---

## Setup

```bash
cd server
npm install

cp .env.example .env
# Add your OPENAI_API_KEY to .env

mkdir -p uploads   # temp file storage
npm run dev
```

---

## API Endpoints

| Method | Route                  | Description                                  |
|--------|------------------------|----------------------------------------------|
| POST   | `/api/resume/upload`   | Upload resume file → full portfolio JSON     |
| POST   | `/api/resume/rewrite`  | Rewrite existing portfolio with a new tone   |
| POST   | `/api/resume/theme`    | Get AI-suggested visual theme                |
| PUT    | `/api/resume/section`  | Manually update a specific portfolio section |
| GET    | `/api/health`          | Health check                                 |

---

## POST `/api/resume/upload`

**Content-Type:** `multipart/form-data`

| Field           | Type   | Required | Description                                           |
|-----------------|--------|----------|-------------------------------------------------------|
| `file`          | File   | ✅       | Resume file (.pdf, .docx, .txt). Max 5MB.             |
| `tone`          | string | ❌       | `professional` \| `casual` \| `creative` \| `technical` |
| `generateTheme` | string | ❌       | `"true"` (default) or `"false"`                       |

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolio": { ... },
    "branding": {
      "tagline": "...",
      "bio": "...",
      "cta": "..."
    },
    "theme": {
      "theme": "dark",
      "primaryColor": "#0f172a",
      "accentColor": "#38bdf8",
      "layout": "sidebar",
      "font": "sans-serif"
    },
    "meta": { ... }
  }
}
```

---

## POST `/api/resume/rewrite`

**Content-Type:** `application/json`

```json
{
  "portfolio": { ... },
  "tone": "creative"
}
```

---

## POST `/api/resume/theme`

```json
{
  "portfolio": { ... }
}
```

---

## PUT `/api/resume/section`

```json
{
  "portfolio": { ... },
  "section": "summary",
  "value": "New summary text here..."
}
```

---

## Architecture

```
server/
├── config/
│   └── openai.js          ← OpenAI client singleton
├── controllers/
│   └── resumeController.js ← Route handlers & pipeline orchestration
├── routes/
│   └── resumeRoutes.js    ← Express router + Multer config
├── services/
│   ├── aiService.js       ← All GPT-4o interactions
│   └── parserService.js   ← PDF/DOCX text extraction
├── middlewares/
│   └── errorHandler.js    ← Centralized error handling + AppError class
├── uploads/               ← Temp files (auto-cleaned after processing)
├── server.js              ← App entry point
└── package.json
```

## AI Pipeline (per upload)

```
Resume File
    ↓ parserService.extractTextFromFile()
Raw Text
    ↓ aiService.extractPortfolioData()      [GPT-4o, temp=0.1]
Structured JSON
    ↓ aiService.rewriteWithTone()           [GPT-4o, temp=0.4–0.8]
Rewritten JSON
    ↓ aiService.generateBioTagline()        [GPT-4o, temp=0.7]
Branding Data
    ↓ aiService.suggestTheme()              [GPT-4o, temp=0.5]
Theme Suggestion
    ↓
Final Response →  { portfolio, branding, theme, meta }
```