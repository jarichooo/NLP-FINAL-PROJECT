# Morphism — Taglish Grammar Correction

A Taglish (Filipino–English code-switched) grammar correction project built as a final requirement for the **Natural Language Processing** course.

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

### What’s implemented

- Flask app factory in `backend/app/__init__.py`
- API routes in `backend/app/routes.py`
- Entrypoint in `backend/main.py`

### API

#### `POST /predict`

**Request body**

```json
{ "text": "<your taglish text>" }
```

**Response**

```json
{
  "original": "...",
  "corrected": "..."
}
```

> Note: The current backend implementation returns **sample/dummy corrections** (see `backend/app/model.py`). This makes the end-to-end app runnable even without loading a large model at runtime.

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

**Course:** Natural Language Processing — CSPC  
**Submission:** Final Project  
**Due:** 2026-05-15
