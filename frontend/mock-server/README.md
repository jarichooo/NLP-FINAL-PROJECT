# Mock Server — Morphism

Simulates the Flask backend API locally so the frontend can function without the real ML backend.

## How to Run

```bash
# From the frontend folder
node mock-server/server.cjs
```

Server starts at: `http://localhost:5001`

## Endpoint

```
POST http://localhost:5001/api/process
Content-Type: application/json

{ "text": "your taglish input here" }
```

Response shape (matches `documentation/api.md`):
```json
{
  "corrected": "...",
  "detected_errors": [
    { "original": "ko", "corrected": "ako", "category": "Pronoun Normalization", "position": 10 }
  ],
  "mixed_kept": ["nag-message"],
  "latency": 0.82,
  "accuracy": 96.4
}
```

## Adding Sample Data

Edit `mock-server/db.json` → `samples` array. Each entry needs:
- `input` — the input sentence the user types
- `corrected` — the corrected output
- `detected_errors` — array of correction objects
- `mixed_kept` — array of Taglish words kept as-is
- `latency` — simulated latency (float)
- `accuracy` — simulated accuracy score (float, 0–100)

## Switching to Real Backend

Open `src/services/api.js` and change:
```js
const BASE_URL = 'http://localhost:5001';  // mock
// to:
const BASE_URL = 'http://localhost:5000';  // real Flask server
```

That's it — no other changes needed.
