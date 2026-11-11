# VedaVerse — Source-Grounded Vedic Knowledge & Scholarly AI Platform

> **Ask. Discover. Verify.**
> Explore Vedic and classical Indian texts through verified Sanskrit sources, traditional commentaries, and transparent AI synthesis — built with strict anti-hallucination guardrails.

---

## Key Features

- **Four-Layer Source-Grounded RAG Engine (`src/lib/rag/engine.ts`)**
  Every query cleanly separates:
  1. **Primary Scripture** — Verified Devanagari, IAST transliteration, canonical reference (`canonical_ref`), meter, rishi, devata, and English translation.
  2. **Traditional Commentary** — Perspectives attributed to recognized commentators and philosophical schools.
  3. **Literal & AI Explanation** — Accessible explanation grounded strictly in retrieved sources (via local Ollama LLM with fast-fail deterministic synthesis fallback).
  4. **Modern Application** — Explicitly labeled contemporary reflection, never blended with scripture.
- **Anti-Hallucination & Citation Audit**
  Detects modern/non-canonical topics (e.g., software engineering, modern tech), explicitly flags `direct_answer_exists: false` with a clear disclaimer, and maps queries to foundational concepts (such as *Svadharma*, *Karma*, or *Vidya*) without fabricating verses.
- **Hybrid Search & Concept Thesaurus (`src/lib/rag/search.ts`)**
  SQLite FTS5 full-text search combined with semantic concept keyword expansion across foundational Vedic concepts (*Dharma*, *Karma*, *Atman*, *Brahman*, *Rta*, *Krodha*, *Indriya Nigraha*, *Vidya*, *Vairagya*, *Satya*, *Moksha*, *Dhyana*, *Svadharma*).
- **Interactive Modules**
  - **Ask VedaVerse** (`/ask`) — Conversational scholarly interface with citation verification badges
  - **Vedic Library & Source Viewer** (`/library`) — Corpus browsing across Vedas, Upanishads, Bhagavad Gita, and Puranas
  - **Concept Explorer** (`/concepts`) — Conceptual links and supporting passages
  - **Sanskrit Analysis** (`/sanskrit`) — Word-by-word Devanagari, IAST, root, and grammatical breakdowns
  - **Compare Traditions** (`/compare`) — Side-by-side comparison of commentarial traditions
  - **Cosmology & Universe** (`/universe`), **Roadmap** (`/roadmap`), **Mantras** (`/mantras`), **Learn** (`/learn`), **Daily Wisdom** (`/daily`), **Research** (`/research`), and **Admin CMS** (`/admin`)

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Lucide Icons
- **Databases:** SQLite (`better-sqlite3` with WAL mode & FTS5) and MongoDB
- **AI / RAG:** Custom Four-Layer RAG Engine + Ollama (`qwen:latest`, `llama3:latest`, `mistral:latest`) with deterministic fallback
- **Authentication:** JWT (`jose`) + `bcryptjs`

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed the Database
```bash
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Start
```bash
npm run build
npm run start
```

### 5. Run Tests
```bash
npm test
```
