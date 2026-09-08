# Cardora — Next.js Frontend

A modern, performant Next.js 16 application for Cardora's car dealership website. Built with React 19, TypeScript, Tailwind CSS, Typesense for vehicle search, and OpenAI GPT-4o for the AI-powered "Dora" search assistant.

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | v18.17.0 minimum — v20 LTS recommended |
| **npm** | v9+ (or yarn v3.6+ / pnpm v8+) |
| **OpenAI API Key** | GPT-4o access required — see [Environment Variables](#-environment-variables) |

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd cardora-fe

# 2. Install all dependencies
npm install

# 3. Copy the environment file and fill in values
cp .env.example .env.local
# → edit .env.local and add your keys (see Environment Variables section)

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root (never commit this file — it is already in `.gitignore`).

```env
# ─── OpenAI ───────────────────────────────────────────────────────────────────
# Required for the AI Search ("Dora Assistant") feature.
# Must have access to gpt-4o.
# Get your key at: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...

# ─── Typesense ────────────────────────────────────────────────────────────────
# These are pulled from the app config at runtime (lib/appConfig.ts).
# If your config is stored server-side you don't need to duplicate them here.
# If you load them from env directly, add the variables your appConfig expects.
```

> **Note for senior devs:** The AI Search route (`app/api/ai-search/route.ts`) reads `OPENAI_API_KEY` from `process.env` at request time. If the key is missing the endpoint returns HTTP 500 and the AI panel shows a graceful error — it will not crash the page.

---

## 📦 All Dependencies

### Runtime Dependencies (`dependencies`)

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.4 | React framework — App Router, SSR, API routes |
| `react` / `react-dom` | 19.2.4 | UI library |
| `typescript` | ^5 | Type safety |
| `tailwindcss` | ^4 | Utility-first CSS |
| `openai` | ^7.9.0 | **AI Search** — OpenAI GPT-4o client. Used in `app/api/ai-search/route.ts` to interpret natural-language queries into structured Typesense filters |
| `typesense` | ^3.0.6 | Typesense client — used in the AI search API route to query the vehicle collection directly |
| `typesense-instantsearch-adapter` | ~2.8.0 | Bridges Typesense to react-instantsearch for the standard filter sidebar |
| `react-instantsearch` | ^7.30.0 | Search UI widgets (refinements, hits, infinite scroll) |
| `@tanstack/react-query` | ^5.99.2 | Server state / data fetching |
| `zod` | ^4.3.6 | Runtime schema validation — used to validate OpenAI JSON responses in the AI search route |
| `lucide-react` | ^1.21.0 | Icon library |
| `framer-motion` | ^12.40.0 | Animations |
| `recharts` | ^3.8.1 | Charts (payment calculator) |
| `sonner` | ^2.0.7 | Toast notifications |
| `lightgallery` | ^2.9.0 | Vehicle image lightbox |
| `jspdf` | ^4.2.1 | PDF generation |
| `next-themes` | ^0.4.6 | Dark mode support |
| `tailwind-merge` | ^2.2.0 | Merge Tailwind class names safely |
| `@fortawesome/react-fontawesome` | ^3.3.1 | FontAwesome React component |
| `@fortawesome/fontawesome-svg-core` | ^7.2.0 | FontAwesome core |
| `@fortawesome/free-solid-svg-icons` | ^7.2.0 | FontAwesome solid icons |
| `@fortawesome/free-regular-svg-icons` | ^7.2.0 | FontAwesome regular icons |
| `@fortawesome/free-brands-svg-icons` | ^7.2.0 | FontAwesome brand icons |

### Dev Dependencies (`devDependencies`)

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss-animate` | ^1.0.6 | Animation utilities for Tailwind |
| `@tailwindcss/postcss` | ^4 | PostCSS plugin for Tailwind v4 |
| `eslint` | ^9 | Linting |
| `eslint-config-next` | 16.2.4 | Next.js ESLint rules |
| `@types/node` | ^20 | Node.js types |
| `@types/react` | ^19 | React types |
| `@types/react-dom` | ^19 | React DOM types |

---

## 🤖 AI Search Feature (Dora Assistant)

### Overview

"Dora" is a natural-language vehicle search assistant embedded in the inventory page. Users describe what they want in plain English ("a family SUV under $35k with low mileage") and the assistant translates that into Typesense filter queries, returning matching inventory results in a swipeable mobile carousel or a desktop grid.

### How it works

```
User message
    ↓
POST /api/ai-search
    ↓
OpenAI GPT-4o (gpt-4o, JSON mode)
  → intent: "search" | "chat"
  → structured filters (make, model, price, odometer, body_type, …)
    ↓
Typesense vehicle collection query
  → auto-relaxation if zero results (widens ranges, drops filters one by one)
    ↓
JSON response → AISearchPanel.tsx renders results
```

### Key files

| File | Role |
|------|------|
| `app/api/ai-search/route.ts` | API route — handles OpenAI call, Typesense query, filter relaxation, pagination (`loadMore`), and direct-filter chip searches |
| `components/inventory/AISearch/AISearchPanel.tsx` | All client-side UI — `useAISearch` hook, `AIChatSidebar`, `AIResultsPanel`, `MobileResultsCarousel` |
| `lib/aiChatStorage.ts` | IndexedDB persistence — saves/restores chat history and result snapshots across page reloads |

### What to install for AI Search

The AI Search feature depends on these packages which are **already in `package.json`** — a standard `npm install` is all that's needed:

```bash
npm install
```

Specific packages the AI search feature relies on:

```bash
# If you ever need to install them individually:
npm install openai@^7.9.0    # OpenAI GPT-4o client (server-side API route)
npm install zod@^4.3.6       # JSON response validation
npm install typesense@^3.0.6 # Direct Typesense queries in the API route
```

### Environment variable required

```env
OPENAI_API_KEY=sk-...
```

Without this key the `/api/ai-search` endpoint returns a 500 and the UI shows a graceful error message. The rest of the site (normal search, filters, inventory) is completely unaffected.

### Chat persistence (IndexedDB)

`lib/aiChatStorage.ts` uses the browser's native **IndexedDB** API — no extra package needed. It stores:
- Chat message history (`id`, `role`, `text`)
- The last active result snapshot (so results survive a page reload)

It is dynamically imported (never runs during SSR) and silently no-ops if IndexedDB is unavailable.

---

## 🏗️ Architecture

### Folder Structure

```
app/
├── api/
│   └── ai-search/route.ts   # AI Search API endpoint
├── inventory/
│   └── page.tsx             # Main inventory page (InstantSearch + AI mode)
├── layout.tsx
└── page.tsx

components/
├── inventory/
│   ├── AISearch/
│   │   └── AISearchPanel.tsx  # All AI Search UI + useAISearch hook
│   ├── HitCard.tsx
│   ├── HitCardSkeleton.tsx
│   └── index.ts
├── layout/                  # Header, Footer
└── common/                  # Shared components (GetInTouch, etc.)

lib/
├── aiChatStorage.ts         # IndexedDB persistence for AI chat
├── appConfig.ts             # Runtime app / Typesense config
├── typesense.ts             # Typesense client factory
└── inventoryRouting.ts      # react-instantsearch URL routing
```

### Path Aliases

| Alias | Resolves to |
|-------|------------|
| `@/app` | `app/` |
| `@/components` | `components/` |
| `@/lib` | `lib/` |
| `@/assets` | `assets/` |
| `@/constants` | `constants/` |
| `@/types` | `types/` |
| `@/context` | `context/` |

---

## �️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (uses `--webpack` flag) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard:
   - `OPENAI_API_KEY` — required for AI Search
   - Any Typesense / app config variables your `lib/appConfig.ts` reads
4. Vercel auto-detects Next.js — no extra config needed
5. Deploys on every push to `main`

### Environment Variables on Vercel

Go to **Project → Settings → Environment Variables** and add:

| Variable | Required | Notes |
|----------|----------|-------|
| `OPENAI_API_KEY` | ✅ Yes | AI Search will be broken without this |

---

## 🐛 Troubleshooting

### AI Search returns errors / not working

1. Check `OPENAI_API_KEY` is set in `.env.local` and has GPT-4o access
2. Check server logs — the route logs all errors with prefix `AI Search Error:`
3. Verify Typesense connection — the AI route also queries Typesense directly for facet values

### Port 3000 already in use

```bash
# Next.js will automatically try the next available port
npm run dev
```

### Build errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Dependency issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### IndexedDB not persisting chat history

IndexedDB requires a secure context (HTTPS or localhost). On non-secure origins the storage silently no-ops — the chat still works, it just won't survive a reload.

---

## 🎯 Key Features

- ✅ Server-side rendering with Next.js 16 App Router
- ✅ Type-safe development with TypeScript
- ✅ Responsive design with Tailwind CSS v4
- ✅ Real-time faceted search with Typesense + react-instantsearch
- ✅ **AI-powered natural-language search** with OpenAI GPT-4o (Dora Assistant)
- ✅ AI chat history persisted across reloads via IndexedDB
- ✅ Mobile swipeable vehicle carousel with dot navigation
- ✅ Client-side state management with React Query
- ✅ Runtime validation with Zod
- ✅ Accessibility-focused components
- ✅ Image optimisation with Next.js Image component
- ✅ Dark mode support with next-themes

---

## 📄 License

This project is proprietary to Cardora. All rights reserved.

---

**Last Updated:** September 2026  
**Next.js Version:** 16.2.4  
**Node.js Minimum:** v18.17.0  
**AI Model:** OpenAI GPT-4o
