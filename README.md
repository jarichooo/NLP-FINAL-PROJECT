# TaGramCheck — Hybrid NLP Grammar Checker for Taglish

A hybrid NLP-based grammar correction system for **Tagalog and Taglish (code-switched)** text. Built as a final project for CSPC's Natural Language Processing course.

---

## Overview

Filipino digital communication heavily relies on **Taglish** — a natural blend of Tagalog and English used in social media, messaging, and online content. Existing grammar tools are built for monolingual English and fail entirely on code-switched Filipino text.

This project addresses that gap with a two-stage pipeline:

1. **Error Detection** — Fine-tuned `Tagalog RoBERTa` transformer performs token-level binary classification to flag grammatical anomalies
2. **Error Correction** — A deterministic rule-based morpho-syntactic engine applies precise affix and syntactic corrections to flagged tokens

---

## Architecture

```
Raw Taglish Input
       │
       ▼
┌─────────────────────┐
│  Data Preprocessing │  ← calamanCy (POS tagging, subword tokenization)
│  (TweetTaglish)     │    URL/emoji/hashtag removal, normalization
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Error Detection    │  ← Fine-tuned Tagalog RoBERTa (token classification)
│  Module             │    Outputs: [CORRECT] / [ANOMALOUS] per token
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Error Correction   │  ← Rule-based morpho-syntactic engine
│  Module             │    Handles: affix errors, word order (Karaniwang/
└─────────┬───────────┘    Di-Karaniwang Anyo), verb-prefix mismatches
          │
          ▼
   Corrected Taglish Output
          │
          ▼
┌─────────────────────┐
│  Flask REST API     │  ← Real-time web interface
└─────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language Model | `Tagalog RoBERTa` (fine-tuned) |
| NLP Toolkit | `calamanCy` (POS tagging, tokenization) |
| Dataset | `TweetTaglish` corpus |
| Backend | `Flask` (REST API) |
| Frontend | React |
| Testing | `pytest` (backend), `Jest` (frontend) |
| CI/CD | GitHub Actions |

---

## Dataset

- **Source:** TweetTaglish corpus — real Taglish social media posts
- **Size:** 21,152 samples (after synthetic error injection)
- **Split:** 80/20 train-test

| Label | Train | Test | Total |
|---|---|---|---|
| Valid Taglish (Correct) | 15,230 | 3,807 | 19,037 |
| Anomalous Taglish (Error) | 1,692 | 423 | 2,115 |

---

## Evaluation Metrics

Given the **severe class imbalance** (correct tokens vastly outnumber errors), standard accuracy is intentionally omitted. The system is evaluated using:

- **Precision** — minimizes over-correction of valid code-switching
- **Recall** — ensures actual errors are not missed
- **F1-Score** — harmonic mean; primary benchmark metric
- **MaxMatch (M²) Scorer** — phrase-level correction accuracy against gold standard annotations

---

## Project Structure

```
tagramcheck/
├── backend/
│   ├── app/
│   │   ├── main.py            # Flask app entry point
│   │   ├── model.py           # RoBERTa inference logic
│   │   ├── rules.py           # Rule-based correction engine
│   │   └── preprocessor.py   # calamanCy preprocessing pipeline
│   ├── tests/
│   │   ├── test_api.py
│   │   └── test_model.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   └── package.json
├── data/
│   └── tweettaglish/          # Raw and preprocessed corpus
├── notebooks/                 # Training & evaluation notebooks
├── .github/
│   └── workflows/
│       ├── ci.yml             # Runs on every PR
│       └── deploy.yml         # Runs on merge to main
└── README.md
```

---

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
flask run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Run Tests

```bash
# Backend
cd backend && pytest tests/ --cov=app

# Frontend
cd frontend && npm test
```

---

## CI/CD

Every pull request triggers the CI pipeline (lint + tests). Merging to `main` automatically deploys:
- **Backend** → Render
- **Frontend** → Vercel

Secrets are managed via GitHub Actions repository secrets.

---

## Team

| Name | Role |
|---|---|
| [Sean Xander B. Aquino] | Model training, backend API |
| [Joshua Jericho D. Barja] | Preprocessing pipeline, Backend, Deployment |
| [John Renzzo C. Montenegro] | Rule-based correction engine |
| [John Carlo E. Nas] | Frontend, deployment |
| [Divino Al D. Ricafort] | Frontend, deployment |

---

## Course Info

**Course:** Natural Language Processing — CSPC  
**Submission:** Final Project (FP)  
**Due:** May 15, 2026
