# Morphism — Taglish Grammar Correction

A Taglish (Filipino–English code-switched) grammar correction project built as a final requirement for the **Natural Language Processing** course at CSPC.

Try our App!
https://morphism-ebon.vercel.app/

This repository contains three main parts:

- **`backend/`** — Flask API that exposes a simple correction endpoint
- **`frontend/`** — React + Vite web client
- **`ml_pipeline/`** — training notebook, model artifacts, and supporting documentation

---

## Repository Structure

```
.
├── backend/                 # Flask API + (bundled) model assets
├── frontend/                # React + Vite client
├── ml_pipeline/             # Training + evaluation notebooks/artifacts/docs
├── package.json             # Root JS metadata (frontend tooling)
└── README.md
```

---

## Backend (Flask API)
https://huggingface.co/spaces/jarichooo/Morphism
### What's implemented

- Flask app factory in `backend/app/__init__.py`
- API routes in `backend/app/routes.py`
- Entrypoint in `backend/main.py`

### API

**Base URL:** `https://jarichooo-morphism.hf.space`

#### `POST /api/process`

**Request**

```http
POST https://jarichooo-morphism.hf.space/api/process
Content-Type: application/json
```

**Request body**

```json
{ "text": "<your taglish text>" }
```

**Response**

```json
{
  "original": "...",
  "corrected": "...",
  "changed_words": [{ "original": "...", "corrected": "..." }]
}
```

> **Note:** `changed_words` is a list of word-level diffs between the original and corrected text. Only changed words are included.

**Example (cURL)**

```bash
curl -X POST https://jarichooo-morphism.hf.space/api/process \
  -H "Content-Type: application/json" \
  -d '{"text": "mag-kain siya"}'
```

**Example response**

```json
{
  "original": "mag-kain siya",
  "corrected": "Magkain siya.",
  "changed_words": [
    { "original": "mag-kain", "corrected": "Magkain" },
    { "original": "siya", "corrected": "siya." }
  ]
}
```

> **Rate limit:** 9 requests per 2 minutes.

### Run locally

```bash
cd backend
pip install -r requirements.txt
python main.py
```

By default, the server runs on `http://localhost:5000`.

---

## Frontend (React + Vite)

### Run locally

```bash
cd frontend
npm install
npm run dev
```

---

## ML Pipeline

See `ml_pipeline/README.md` for details on:

- the training notebook workflow
- dataset preparation
- model artifacts and evaluation outputs

---

## Course Info

| | |
|---|---|
| **Course** | Natural Language Processing — CSPC |
| **Submission** | Final Project |
| **Due** | 2026-05-15 |
