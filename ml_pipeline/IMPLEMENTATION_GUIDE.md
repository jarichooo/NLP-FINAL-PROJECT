# Taglish Grammar Correction - Implementation Guide

Complete guide for integrating the Taglish Grammar Correction model into your applications.

---

## Quick Start

### 1. Single Sentence Correction

```python
from standalone_inference import TaglishGrammarCorrector

# Initialize corrector (loads model once)
corrector = TaglishGrammarCorrector(
    model_path="/path/to/taglish_gec_model",
    device="cuda"  # or "cpu"
)

# Correct a sentence
text = "kumusta ka na ba doon"
corrected = corrector.correct(text)
print(corrected)  # Output: "Kumusta ka na ba doon?"
```

### 2. Batch Processing

```python
texts = [
    "6yrs na national id q wala pa din",
    "wala masama pero may problem",
    "bakit ang dumb mo"
]

results = corrector.batch_correct(texts, batch_size=8)
for original, corrected in zip(texts, results):
    print(f"{original} → {corrected}")
```

### 3. Control Output Creativity

```python
# Low temperature = strict corrections (recommended)
corrected = corrector.correct(text, temperature=0.05)

# Higher temperature = more creative output
corrected = corrector.correct(text, temperature=0.3)

# Max length control
corrected = corrector.correct(text, max_length=150)
```

---

## Framework Integration

### Django REST API

```python
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from standalone_inference import TaglishGrammarCorrector

# Initialize globally to avoid reloading
corrector = TaglishGrammarCorrector(
    model_path="/path/to/taglish_gec_model",
    device="cuda"
)

class CorrectTextView(APIView):
    def post(self, request):
        """Correct Taglish text"""
        text = request.data.get("text", "")
        
        if not text:
            return Response({"error": "No text provided"}, status=400)
        
        try:
            corrected = corrector.correct(text)
            return Response({
                "original": text,
                "corrected": corrected
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class CorrectBatchView(APIView):
    def post(self, request):
        """Correct multiple texts"""
        texts = request.data.get("texts", [])
        batch_size = request.data.get("batch_size", 8)
        
        if not texts:
            return Response({"error": "No texts provided"}, status=400)
        
        try:
            results = corrector.batch_correct(texts, batch_size=batch_size)
            return Response({
                "count": len(texts),
                "results": [
                    {"original": orig, "corrected": corr}
                    for orig, corr in zip(texts, results)
                ]
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)

# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("api/correct/", views.CorrectTextView.as_view()),
    path("api/correct-batch/", views.CorrectBatchView.as_view()),
]
```

**Usage:**
```bash
curl -X POST http://localhost:8000/api/correct/ \
  -H "Content-Type: application/json" \
  -d '{"text": "kumusta ka na ba doon"}'
```

---

### FastAPI

```python
# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from standalone_inference import TaglishGrammarCorrector
import asyncio

app = FastAPI(title="Taglish Grammar Correction")

# Global corrector instance
corrector = None

@app.on_event("startup")
async def startup():
    global corrector
    corrector = TaglishGrammarCorrector(
        model_path="/path/to/taglish_gec_model",
        device="cuda"
    )
    print("Model loaded!")

class TextRequest(BaseModel):
    text: str
    temperature: float = 0.05
    max_length: int = 100

class BatchRequest(BaseModel):
    texts: List[str]
    batch_size: int = 8
    temperature: float = 0.05

@app.post("/correct")
async def correct(request: TextRequest):
    """Correct a single Taglish sentence"""
    if not request.text:
        raise HTTPException(status_code=400, detail="Text required")
    
    try:
        corrected = corrector.correct(
            request.text,
            temperature=request.temperature,
            max_length=request.max_length
        )
        return {
            "original": request.text,
            "corrected": corrected
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/correct-batch")
async def correct_batch(request: BatchRequest):
    """Correct multiple sentences"""
    if not request.texts:
        raise HTTPException(status_code=400, detail="Texts required")
    
    try:
        # Run in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(
            None,
            lambda: corrector.batch_correct(request.texts, request.batch_size)
        )
        
        return {
            "count": len(request.texts),
            "results": [
                {"original": orig, "corrected": corr}
                for orig, corr in zip(request.texts, results)
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "ok", "model": "taglish-gec"}
```

**Run:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Test:**
```bash
curl -X POST http://localhost:8000/correct \
  -H "Content-Type: application/json" \
  -d '{"text": "kumusta ka na ba doon", "temperature": 0.05}'
```

---

### Flask

```python
# app.py
from flask import Flask, request, jsonify
from standalone_inference import TaglishGrammarCorrector

app = Flask(__name__)

# Initialize globally
corrector = TaglishGrammarCorrector(
    model_path="/path/to/taglish_gec_model",
    device="cuda"
)

@app.route("/correct", methods=["POST"])
def correct():
    """Correct a single text"""
    data = request.get_json()
    text = data.get("text", "")
    temperature = data.get("temperature", 0.05)
    
    if not text:
        return jsonify({"error": "Text required"}), 400
    
    try:
        corrected = corrector.correct(text, temperature=temperature)
        return jsonify({
            "original": text,
            "corrected": corrected
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/correct-batch", methods=["POST"])
def correct_batch():
    """Correct multiple texts"""
    data = request.get_json()
    texts = data.get("texts", [])
    batch_size = data.get("batch_size", 8)
    
    if not texts:
        return jsonify({"error": "Texts required"}), 400
    
    try:
        results = corrector.batch_correct(texts, batch_size=batch_size)
        return jsonify({
            "count": len(texts),
            "results": [
                {"original": orig, "corrected": corr}
                for orig, corr in zip(texts, results)
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
```

**Run:**
```bash
python app.py
```

---

### Node.js / Express (Python Backend)

For Node.js apps, call the FastAPI/Flask endpoint from Node:

```javascript
// server.js
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PYTHON_API = "http://localhost:8000";  // FastAPI backend

app.post("/api/correct", async (req, res) => {
    try {
        const { text, temperature = 0.05 } = req.body;
        
        const response = await axios.post(`${PYTHON_API}/correct`, {
            text,
            temperature
        });
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/correct-batch", async (req, res) => {
    try {
        const { texts, batch_size = 8 } = req.body;
        
        const response = await axios.post(`${PYTHON_API}/correct-batch`, {
            texts,
            batch_size
        });
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Server on port 3000"));
```

---

## Performance Tips

### 1. Model Loading

- **Load once globally**, not per request
- Cache the corrector instance
- Reuse across requests

```python
# ❌ DON'T do this
def correct_text(text):
    corrector = TaglishGrammarCorrector(...)  # Slow!
    return corrector.correct(text)

# ✅ DO this
corrector = TaglishGrammarCorrector(...)  # Load once
def correct_text(text):
    return corrector.correct(text)  # Reuse
```

### 2. Batch Processing

- Use batch_correct() for multiple texts
- Larger batches = more efficient GPU usage
- Typical batch size: 8-16

```python
# ❌ Slow - one by one
for text in texts:
    corrected = corrector.correct(text)

# ✅ Fast - batch processing
results = corrector.batch_correct(texts, batch_size=8)
```

### 3. GPU Memory

- Use `device="cuda"` for GPU acceleration (4-10x faster)
- Use `device="cpu"` if no GPU available
- Monitor memory with `nvidia-smi`

### 4. Temperature Settings

- **0.05** (strict) - Best for reproducible corrections
- **0.3** (balanced) - Some variation, still reasonable
- **>0.5** (creative) - More unpredictable output

---

## Error Handling

```python
from standalone_inference import TaglishGrammarCorrector

try:
    corrector = TaglishGrammarCorrector(
        model_path="/path/to/model",
        device="cuda"
    )
except FileNotFoundError:
    print("Model not found. Check path.")
except Exception as e:
    print(f"Failed to load model: {e}")

try:
    corrected = corrector.correct(text)
except Exception as e:
    print(f"Correction failed: {e}")
    # Fallback: return original text
    corrected = text
```

---

## Deployment Checklist

- [ ] Model path is correct and accessible
- [ ] GPU/CUDA is available (or CPU fallback works)
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] Model loaded once globally (not per request)
- [ ] Error handling in place
- [ ] Temperature/max_length defaults are sensible
- [ ] Batch size tuned for your hardware
- [ ] Health check endpoint implemented
- [ ] API documentation available
- [ ] Tested with sample Taglish sentences

---

## Common Issues

### Model Takes Too Long to Load
- First load caches weights: ~30-60 seconds
- Subsequent requests use cache: <1 second
- Solution: Load model at startup, not per request

### Out of Memory (OOM) Errors
- Reduce batch size: `batch_correct(texts, batch_size=4)`
- Use CPU instead: `device="cpu"`
- Use smaller max_length: `max_length=50`

### Incorrect Corrections
- Model quality depends on training data
- Consider retraining with more examples
- Check temperature setting (use 0.05 for strict mode)

### GPU Not Used
- Verify CUDA installed: `nvidia-smi`
- Ensure PyTorch installed for CUDA: `pip install torch --index-url https://download.pytorch.org/whl/cu121`
- Check device param: `device="cuda"`

---

## Example Request/Response

### Single Correction

**Request:**
```json
{
  "text": "6yrs na national id q wala pa din"
}
```

**Response:**
```json
{
  "original": "6yrs na national id q wala pa din",
  "corrected": "6 years na national ID ko wala pa rin."
}
```

### Batch Correction

**Request:**
```json
{
  "texts": [
    "kumusta ka na ba doon",
    "bakit ang dumb mo",
    "wala masama pero may problem"
  ],
  "batch_size": 8
}
```

**Response:**
```json
{
  "count": 3,
  "results": [
    {
      "original": "kumusta ka na ba doon",
      "corrected": "Kumusta ka na ba doon?"
    },
    {
      "original": "bakit ang dumb mo",
      "corrected": "Bakit ka ganyan?"
    },
    {
      "original": "wala masama pero may problem",
      "corrected": "Wala namang masama, pero may problem."
    }
  ]
}
```

---

## Support & Troubleshooting

For issues or questions:
1. Check model training completed successfully
2. Verify model path is correct
3. Test with `python test_model.py`
4. Check GPU availability: `nvidia-smi`
5. Review error messages in logs
