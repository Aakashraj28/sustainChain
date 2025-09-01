
# Frontend (React + Vite + Tailwind)

## Setup
```bash
cd frontend
npm install
npm run dev
```
Runs at http://localhost:5173 (expects backend at http://localhost:5000).

## Pages
- Landing page (links to SustainChain & FreshBites)
- SustainChain Home → Choose Industry / Upload CSV
- IndustrySelection → redirects to Results
- UploadCSV → POST /api/upload then redirects to Results
- ResultsPage → Weight sliders + Top 10 + Full list
