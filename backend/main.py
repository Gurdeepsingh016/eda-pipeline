import json
import io
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, HTMLResponse
import pandas as pd

from upload import parse_and_validate_csv
from cleaning import clean_dataset
from ai import run_ai_data_cleaner
from eda import generate_eda_profile
from charts import generate_chart_payloads
from export import generate_csv_bytes, generate_html_report

app = FastAPI(title="EDA Pipeline API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for session dataset
CURRENT_DATASET = {}

@app.get("/")
def read_root():
    return {"status": "ok", "message": "EDA Pipeline API is running"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Step 1 & 2: Upload CSV and return preview metadata."""
    content = await file.read()
    try:
        preview = parse_and_validate_csv(content, file.filename)
        # Store in session memory
        CURRENT_DATASET["filename"] = file.filename
        CURRENT_DATASET["df"] = pd.read_csv(io.BytesIO(content))
        return preview
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/process")
async def process_pipeline(file: UploadFile = File(None), params: str = Form("{}")):
    """Step 3, 4 & 5: Process Data & AI Cleaning."""
    try:
        param_dict = json.loads(params)
    except Exception:
        param_dict = {}

    if file:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
        filename = file.filename
    elif "df" in CURRENT_DATASET:
        df = CURRENT_DATASET["df"].copy()
        filename = CURRENT_DATASET["filename"]
    else:
        raise HTTPException(status_code=400, detail="No dataset uploaded")

    before_rows = len(df)
    before_missing = int(df.isna().sum().sum())

    # Step 5: Run AI Cleaner if enabled
    ai_logs = []
    if param_dict.get("enableAICleaning", True):
        df, ai_logs = run_ai_data_cleaner(df)

    # Step 3 & 4: Process Data using cleaning strategies
    cleaned_df, cleaning_logs = clean_dataset(df, param_dict)
    all_logs = ai_logs + cleaning_logs

    # Step 6: Generate EDA & Charts
    eda_profile = generate_eda_profile(cleaned_df)
    chart_payloads = generate_chart_payloads(cleaned_df)

    after_rows = len(cleaned_df)
    after_missing = int(cleaned_df.isna().sum().sum())

    report_payload = {
        "healthScore": eda_profile["health_score"],
        "beforeStats": {"rows": before_rows, "missing": before_missing},
        "afterStats": {"rows": after_rows, "missing": after_missing},
        "transformations": all_logs,
        "summary": "Dataset processed and audited successfully."
    }

    # Store cleaned dataset in memory for downloads
    CURRENT_DATASET["cleaned_df"] = cleaned_df
    CURRENT_DATASET["report_payload"] = report_payload
    CURRENT_DATASET["filename"] = filename

    return {
        "cleanedRows": cleaned_df.head(50).to_dict(orient="records"),
        "eda": {
            "columns": eda_profile["columns"],
            "distributions": chart_payloads["distributions"],
            "correlation": eda_profile["correlation"]
        },
        "report": report_payload
    }

@app.get("/api/download/csv")
def download_clean_csv():
    """Step 7: Download Clean CSV endpoint."""
    if "cleaned_df" not in CURRENT_DATASET:
        raise HTTPException(status_code=404, detail="No processed dataset found")
    
    csv_bytes = generate_csv_bytes(CURRENT_DATASET["cleaned_df"])
    filename = f"Cleaned_{CURRENT_DATASET.get('filename', 'dataset.csv')}"
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@app.get("/api/download/report")
def download_html_report():
    """Step 8: Download Report endpoint."""
    if "report_payload" not in CURRENT_DATASET:
        raise HTTPException(status_code=404, detail="No report generated")
    
    rep = CURRENT_DATASET["report_payload"]
    html_content = generate_html_report(
        filename=CURRENT_DATASET.get("filename", "Dataset.csv"),
        health_score=rep["healthScore"],
        before_rows=rep["beforeStats"]["rows"],
        after_rows=rep["afterStats"]["rows"],
        missing_cleaned=rep["beforeStats"]["missing"] - rep["afterStats"]["missing"],
        logs=rep["transformations"]
    )
    return HTMLResponse(content=html_content)
