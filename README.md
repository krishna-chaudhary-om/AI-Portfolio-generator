# 🚀 AI Portfolio Generator

> Transform your resume into a stunning portfolio website in seconds — powered by AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![React](https://img.shields.io/badge/react-18-61DAFB.svg)

---

## 📸 Demo

> Upload your resume PDF → AI extracts your info → Beautiful portfolio generated instantly.

---

## ✨ Features

- 📄 **PDF & Text Resume Support** — Upload a PDF or paste resume text directly
- 🤖 **Multi-AI Provider** — Switch between OpenAI GPT-4o, Google Gemini, or Anthropic Claude
- 🎨 **Themes & Layouts** — Multiple visual themes and layout options to choose from
- ✏️ **Live Editing** — Edit any section of your portfolio after generation
- 👀 **Instant Preview** — See your portfolio update in real time
- 🔌 **No Backend Required** — AI calls made directly from the browser
- 🧪 **Mock Mode** — Test the full UI flow without spending any API credits

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router, CSS Modules |
| PDF Parsing | pdf.js (in-browser, no server needed) |
| AI Providers | OpenAI GPT-4o, Google Gemini 2.0 Flash, Anthropic Claude Sonnet |
| Backend (optional) | Node.js, Express, MongoDB, JWT, Multer |

---

## 📁 Project Structure

```
ai-portfolio-generator/
├── client/                        # React frontend (Vite)
│   ├── src/
│   │   ├── components/            # UI components (Hero, Skills, Projects etc.)
│   │   ├── context/               # Global portfolio state
│   │   ├── hooks/                 # useUpload — core AI + PDF logic
│   │   ├── pages/                 # Home, Preview pages
│   │   ├── services/              # API helpers & mock data
│   │   └── styles/                # Global styles & themes
│   ├── .env                       # ← your API keys go here (never commit)
│   └── vite.config.js
└── server/                        # Express backend (optional)
    ├── src/
    │   ├── config/                # DB & AI config
    │   ├── controllers/           # Route handlers & pipeline orchestration
    │   ├── middleware/            # Auth, upload, rate limiting
    │   ├── models/                # MongoDB models
    │   ├── routes/                # API routes
    │   └── services/              # AI & portfolio services
    └── .env                       # ← server secrets (never commit)
```

---

## ⚡ Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/krishna-chaudhary-om/AI-Portfolio-generator.git
cd AI-Portfolio-generator
```

### 2. Install dependencies

```bash
# Frontend
cd client
npm install

# Backend (optional)
cd ../server
npm install
cp .env.example .env
mkdir -p uploads
```

### 3. Set up environment variables

Create `client/.env`:

```dotenv
VITE_USE_MOCK=false
VITE_AI_PROVIDER=openai          # openai | gemini | claude
VITE_OPENAI_API_KEY=your_key_here
VITE_API_URL=http://localhost:5000
```

Create `server/.env`:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portfolio_generator
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_key_here
GEMINI_MODEL=gemini-2.0-flash
MAX_FILE_SIZE_MB=10
UPLOAD_DIR=./uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### 4. Run the app

```bash
# Start frontend
cd client
npm run dev
```

```bash
# Start backend (optional, separate terminal)
cd server
npm run dev
```

Visit **http://localhost:5173** 🎉

---

## 🤖 AI Provider Setup

Set `VITE_AI_PROVIDER` in `client/.env` to switch providers.

### OpenAI (GPT-4o)
1. Get API key → [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Add billing credits → [platform.openai.com/settings/billing](https://platform.openai.com/settings/billing)
3. Set in `client/.env`:
```dotenv
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-...
```
> ⚠️ ChatGPT Pro subscription does **not** include API credits — billing is separate.

### Google Gemini
1. Get API key → [aistudio.google.com](https://aistudio.google.com)
2. Set in `client/.env`:
```dotenv
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=AIza...
VITE_GEMINI_MODEL=gemini-2.0-flash
```

### Anthropic Claude
1. Get API key → [console.anthropic.com](https://console.anthropic.com)
2. Set in `client/.env`:
```dotenv
VITE_AI_PROVIDER=claude
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

---

## 🧪 Mock Mode

Test the full app without using any API credits:

```dotenv
VITE_USE_MOCK=true
```

Uses a built-in sample portfolio to simulate the full generation flow.

---

## 🌐 API Endpoints (Server)

| Method | Route | Description |
|---|---|---|
| POST | `/api/resume/upload` | Upload resume file → full portfolio JSON |
| POST | `/api/resume/rewrite` | Rewrite portfolio with a new tone |
| POST | `/api/resume/theme` | Get AI-suggested visual theme |
| PUT | `/api/resume/section` | Manually update a portfolio section |
| GET | `/api/health` | Health check |

### POST `/api/resume/upload`
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | Resume file (.pdf, .docx, .txt). Max 5MB. |
| `tone` | string | ❌ | `professional` \| `casual` \| `creative` \| `technical` |
| `generateTheme` | string | ❌ | `"true"` (default) or `"false"` |

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolio": { "..." : "..." },
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
    "meta": { "..." : "..." }
  }
}
```

---

## 🔄 AI Pipeline

```
Resume File
    ↓ Extract text (pdf.js / parserService)
Raw Text
    ↓ extractPortfolioData()     [GPT-4o, temp=0.1]
Structured JSON
    ↓ rewriteWithTone()          [GPT-4o, temp=0.4–0.8]
Rewritten JSON
    ↓ generateBioTagline()       [GPT-4o, temp=0.7]
Branding Data
    ↓ suggestTheme()             [GPT-4o, temp=0.5]
Theme Suggestion
    ↓
Final Response → { portfolio, branding, theme, meta }
```

---

## 📜 Scripts

### Client
| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Server
| Command | Description |
|---|---|
| `npm run dev` | Start with hot reload (nodemon) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🚢 Deployment

### Frontend → Vercel / Netlify
1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com)
3. Add your `client/.env` variables in the dashboard
4. Deploy ✅

### Backend → Railway / Render
1. Import repo on [railway.app](https://railway.app) or [render.com](https://render.com)
2. Add your `server/.env` variables in the dashboard
3. Set start command: `npm start`
4. Deploy ✅

---

## 🔒 Security

- **Never commit `.env` files** — already in `.gitignore`
- **Never share API keys** — regenerate immediately if exposed
- For production, route all AI calls through your backend instead of directly from the browser

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m "Add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use for personal and commercial projects.

---

## 🙏 Acknowledgements

- [pdf.js](https://mozilla.github.io/pdf.js/) — in-browser PDF parsing
- [OpenAI](https://openai.com), [Google Gemini](https://ai.google.dev), [Anthropic](https://anthropic.com) — AI APIs
- [Vite](https://vitejs.dev) — lightning fast dev experience

---

<p align="center">Made with ❤️ by <a href="https://github.com/krishna-chaudhary-om">krishna-chaudhary-om</a></p>
