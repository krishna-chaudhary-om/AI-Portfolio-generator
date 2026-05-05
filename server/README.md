# Portfolio Generator — Backend API

Node.js + Express backend for the AI-powered portfolio generator.

## Stack
- **Express** — HTTP server & routing
- **MongoDB + Mongoose** — data storage
- **OpenAI GPT-4o** — resume → portfolio content generation
- **pdf-parse + mammoth** — PDF & DOCX resume parsing
- **JWT** — stateless auth
- **Winston** — structured logging
- **multer** — file uploads (in-memory, no disk writes)

## Quick start

```bash
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, OPENAI_API_KEY

npm install
npm run dev
```

## API Reference

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login → JWT |
| GET | `/api/auth/me` | ✓ | Current user |
| PATCH | `/api/auth/me` | ✓ | Update profile |

### Upload & Generation
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/upload/resume` | ✓ | Upload PDF/DOCX → generate portfolio |

**Form data fields:**
- `resume` — file (PDF or DOCX, max 10MB)
- `theme` — `professional` | `creative` | `minimal` | `dark` | `vibrant`
- `layout` — `single-page` | `multi-section` | `card-grid`
- `tone` — `professional` | `casual` | `bold`

### Portfolios
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/portfolios` | ✓ | List my portfolios (paginated) |
| GET | `/api/portfolios/:id` | ✓ | Get portfolio |
| PATCH | `/api/portfolios/:id` | ✓ | Update content/settings |
| DELETE | `/api/portfolios/:id` | ✓ | Delete portfolio |
| GET | `/api/portfolios/share/:shareId` | — | Public share link |

### Health
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Server status |

## Project structure

```
src/
├── index.js              # Entry point
├── app.js                # Express setup, middleware stack
├── config/
│   ├── database.js       # MongoDB connection
│   └── openai.js         # OpenAI client
├── models/
│   ├── User.js           # User schema (bcrypt, toJSON)
│   └── Portfolio.js      # Portfolio schema
├── services/
│   ├── resumeParser.js   # PDF + DOCX extraction
│   ├── openaiService.js  # GPT-4o generation + prompt
│   └── portfolioService.js # Business logic
├── controllers/
│   ├── authController.js
│   ├── portfolioController.js
│   └── uploadController.js
├── routes/
│   ├── auth.js
│   ├── portfolio.js
│   ├── upload.js
│   └── user.js
├── middleware/
│   ├── auth.js           # JWT protect
│   ├── upload.js         # multer config
│   ├── rateLimiter.js    # global + auth + generation limiters
│   ├── validate.js       # express-validator rules
│   ├── errorHandler.js   # global error handler
│   └── notFound.js       # 404
└── utils/
    ├── AppError.js       # Operational error class
    ├── catchAsync.js     # Async error wrapper
    └── logger.js         # Winston logger
```

## Rate limits
- **Global:** 100 req / 15 min per IP
- **Auth endpoints:** 10 req / 15 min per IP
- **Generation:** 20 req / hour per IP

## Environment variables
See `.env.example` for all variables.
