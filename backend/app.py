import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np


# --- Config ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join("/tmp", "uploads")
TOKEN_DIR  = os.getenv("TOKEN_DIR",  "tokens")
DATA_DIR = os.path.join(BASE_DIR, "data")  

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(TOKEN_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

app = Flask(__name__)
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "*")  # During dev you can leave "*"
CORS(app, resources={r"/api/*": {"origins": FRONTEND_ORIGIN}})

@app.get("/api/health")
def health():
    return jsonify({"ok": True})


def normalize_df(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalize columns to expected schema:
    company, revenue_musd, emissions_ton, certified, target_year, industry
    - Cleans commas in numeric fields
    - Converts certified to bool
    - Preserves any extra columns (base_year, num_target_types, emissions1-4, etc.)
    """
    df = df.copy()
    df.columns = [c.strip().lower() for c in df.columns]

    # Column aliases
    colmap = {
    "company": ["company", "name", "company_name"],
    "revenue_musd": ["revenue_musd", "revenue", "revenue_musd($)", "revenue_musd_usd"],
    "emissions_ton": ["emissions_ton", "emissions", "carbon_emissions", "co2e_tons"],
    "certified": ["certified", "iso_certificate", "iso_certified", "environmental_certification"],
    "target_year": ["target_year", "net_zero_year", "netzero_year", "target_net_zero_year"],
    "industry": ["industry", "sector", "industry_name", "business_sector"],
    "base_year": ["base_year", "baseline_year", "reference_year"],
    "num_target_types": ["num_target_types", "target_types", "number_of_target_types"]
}


    def pick(df, keys, default=None):
        for k in keys:
            if k in df.columns:
                return df[k]
        return pd.Series([None] * len(df))

    out = pd.DataFrame()

    # --- Company ---
    out["company"] = pick(df, colmap["company"], "").fillna("").astype(str)

    # --- Revenue ---
    rev = pick(df, colmap["revenue_musd"], 0)
    out["revenue_musd"] = pd.to_numeric(
        rev.astype(str).str.replace(",", ""), errors="coerce"
    ).fillna(0)

    # --- Emissions ---
    emi = pick(df, colmap["emissions_ton"], 0)
    out["emissions_ton"] = pd.to_numeric(
        emi.astype(str).str.replace(",", ""), errors="coerce"
    ).fillna(0)

    # --- Certification ---
    cert = pick(df, colmap["certified"], False)

    def to_bool(x):
        if isinstance(x, bool):
            return x
        if pd.isna(x):
            return False
        s = str(x).strip().lower()
        return s in ("yes", "true", "1", "y", "certified")

    out["certified"] = cert.map(to_bool) if cert is not None else False

    # --- Target Year ---
    yr = pick(df, colmap["target_year"], None)
    out["target_year"] = pd.to_numeric(yr, errors="coerce")

    # --- Industry ---
    ind = pick(df, colmap["industry"], "").fillna("").astype(str)
    out["industry"] = ind.str.strip()

    base = pick(df, colmap["base_year"], "").fillna("").astype(str)
    out["base_year"] = pd.to_numeric(base, errors="coerce")

    num = pick(df, colmap["num_target_types"], "").fillna("").astype(str)
    out["num_target_types"] = pd.to_numeric(num, errors="coerce")

    # --- Preserve all extra columns ---
    base_cols = set(out.columns)
    for col in df.columns:
        if col not in base_cols:
            out[col] = df[col]

    # Drop rows without company
    out = out[out["company"].str.strip() != ""].reset_index(drop=True)

    return out




@app.route("/api/health")
def health2():
    return jsonify({"ok": True})


@app.route("/api/upload", methods=["POST"])
def upload():
    """
    Accepts a CSV file, normalizes it, saves to tokens/<token>.csv and returns the token.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    f = request.files["file"]
    if not f.filename.lower().endswith(".csv"):
        return jsonify({"error": "Please upload a CSV"}), 400

    # Save raw upload (optional)
    raw_path = os.path.join(UPLOAD_DIR, f.filename)
    f.save(raw_path)

    # Read + normalize
    try:
        df = pd.read_csv(raw_path)
    except Exception as e:
        return jsonify({"error": f"Failed to read CSV: {e}"}), 400

    df = normalize_df(df)

    # Create token and persist a normalized copy
    token = str(uuid.uuid4())
    token_path = os.path.join(TOKEN_DIR, f"{token}.csv")
    df.to_csv(token_path, index=False)

    return jsonify({"token": token, "count": len(df)})


@app.route("/api/results", methods=["GET"])
def results_by_token():
    """
    Returns suppliers for a previously uploaded file:
    GET /api/results?token=<uuid>
    """
    token = request.args.get("token", "").strip()
    if not token:
        return jsonify({"error": "Token is required"}), 400

    token_path = os.path.join(TOKEN_DIR, f"{token}.csv")
    if not os.path.exists(token_path):
        return jsonify({"error": "Invalid token or data expired"}), 404

    try:
        df = pd.read_csv(token_path)
        # Ensure normalized
        df = normalize_df(df)
        df = df.replace({np.nan: None})

        return jsonify({"suppliers": df.to_dict(orient="records")})
    except Exception as e:
        return jsonify({"error": f"Failed to load token data: {e}"}), 500


@app.route("/api/results/industry", methods=["GET"])
def results_by_industry():
    """
    Returns suppliers from the combined industry CSV:
    GET /api/results/industry?industry=Chemicals
    """
    industry = request.args.get("industry", "").strip()
    if not industry:
        return jsonify({"error": "Industry is required"}), 400

    path = os.path.join(DATA_DIR, "all_industries.csv")
    if not os.path.exists(path):
        return jsonify({"error": "Master industry CSV not found"}), 404

    try:
        print(f"Reading CSV: {path}")  # Debug log
        df = pd.read_csv(path, quotechar='"', skipinitialspace=True, engine="python")

        print("Raw columns:", df.columns.tolist())  # Debug log
        print("First 3 rows:", df.head(3).to_dict(orient="records"))  # Debug log
        df = normalize_df(df)
        df.columns = df.columns.str.strip().str.lower()
        

        if industry.lower() == "unlisted":
            filtered = df[df["industry"].isna() | (df["industry"].str.strip() == "")]
        else:
            filtered = df[df["industry"].str.lower() == industry.lower()]
        filtered = filtered.replace({np.nan: None})
        
        return jsonify({"suppliers": filtered.to_dict(orient="records")})
    except Exception as e:
        import traceback
        traceback.print_exc()   # <-- full traceback in console
        return jsonify({"error": f"Failed to read industry data: {e}"}), 500





if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
    
