
# Backend (Flask) – SustainChain Ranking API

## Endpoints
- `GET /api/industries` → list available industry datasets
- `POST /api/upload` → upload a CSV (columns: company, revenue_musd, emissions_ton, certified, target_year)
  - returns `{ "token": "<id>" }`
- `POST /api/rank` → compute rankings
  - Body options:
    - `{"industry":"chemical","weights":{"emission":0.5,"cert":0.2,"year":0.3}}`
    - `{"token":"<upload_token>","weights":{...}}`
    - `{"rows":[{...}, {...}],"weights":{...}}`

## Scoring
- Emission intensity = emissions_ton / revenue_musd (lower better)
- Certification: boolean (True better)
- Net-zero target year: earlier better
- All normalized & combined with user weights to form `final_score` (higher better).
