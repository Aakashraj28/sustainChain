
# SCM Suite (SustainChain + FreshBites)

An integrated project with:
- **Landing page** linking both tools
- **SustainChain**: sustainable supplier selection & ranking
- **FreshBites**: placeholder for inventory optimization

## Quick Start

### 1) Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python app.py
```
Runs at **http://localhost:5000**

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173**

## CSV Format
`company, revenue_musd, emissions_ton, certified, target_year`

## API
- `GET /api/industries`
- `POST /api/upload`
- `POST /api/rank`

## Ranking Logic
- Emission intensity (emissions_ton / revenue_musd) → lower is better
- Certification (boolean) → 1 if True else 0
- Net-zero target year → earlier is better
- Normalized, then combined with user-chosen weights (emission/cert/year).
