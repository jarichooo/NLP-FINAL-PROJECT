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

## Methodology

The [training notebook](ml_pipeline/taglish_grammar_correction.ipynb) normalizes and filters noisy/clean Taglish pairs, keeps a sample of unchanged pairs, and splits the resulting 4,247 examples into 3,397 training, 425 validation, and 425 test examples. It fine-tunes `mistralai/Mistral-7B-Instruct-v0.2` with LoRA on `q_proj` and `v_proj`, masking prompt tokens so the loss is computed on correction targets. The trained adapter is used through the Flask API and React client.

## Results and Evaluation

The saved notebook reports a final training loss of **0.5245**. Its displayed generation evaluation processed **20 examples**, with ROUGE-1 **0.9870**, ROUGE-L **0.9864**, and exact match **70% (14/20)**. These are the recorded sample results, not a verified score across the complete held-out split. The notebook and older [model card](ml_pipeline/MODEL_CARD.md) contain differing dataset counts and metrics; use the notebook's saved outputs for the figures above.

[Sample corrections](ml_pipeline/corrections_report.txt), [predictions](ml_pipeline/predictions.csv), and the [evaluation plot](ml_pipeline/model_evaluation.png) are included for review. Remaining limitations include meaning drift, over-translation, and dropped emojis.

## Data and Documentation

- **Source:** [backend](backend/), [frontend](frontend/), and [ML pipeline](ml_pipeline/).
- **Dataset:** [`dataset_final (1).csv`](ml_pipeline/dataset/dataset_final%20(1).csv) is already included. The model card identifies Reddit/Facebook text as its source; dataset redistribution permissions are not documented here.
- **Documentation:** [pipeline guide](ml_pipeline/README.md), [implementation guide](ml_pipeline/IMPLEMENTATION_GUIDE.md), and [quick reference](ml_pipeline/QUICK_REFERENCE.md).

## Topics

`natural-language-processing` `grammar-correction` `taglish` `lora` `flask` `react`
