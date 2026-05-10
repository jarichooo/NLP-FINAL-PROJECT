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

## Backend Rate Limit Requirements

The frontend enforces rate limits client-side (see `src/hooks/useRateLimit.js`), but these can be bypassed via browser DevTools. The real Flask backend should enforce:

### Rules to enforce server-side:
| Rule | Value |
|------|-------|
| Max analyses per rolling window | **9 requests** per IP |
| Rolling window duration | **2 minutes** |
| HTTP status on limit exceeded | **429 Too Many Requests** |

### Flask implementation hints:
- Use `flask-limiter` with `default_limits = ["9 per 2 minutes"]`
- Set `key_func = get_remote_address` (per-IP limiting)
- Return JSON error on 429: `{ "error": "Rate limit exceeded. Try again in X seconds.", "retry_after": N }`
- The frontend already handles `err.response?.data?.error` to display this message cleanly.

### Example Flask setup:
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(app, key_func=get_remote_address)

@app.route('/api/process', methods=['POST'])
@limiter.limit("9 per 2 minutes")
def process():
    ...
```
