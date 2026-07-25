import pandas as pd
from jinja2 import Template
from typing import Dict, Any, List

HTML_REPORT_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>EDA Pipeline Report - {{ filename }}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #f9fafb; padding: 2rem; }
        .container { max-width: 1000px; margin: 0 auto; }
        .card { background: #111827; border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.5rem; }
        h1 { color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 0.5rem; }
        .score { font-size: 2.5rem; font-weight: bold; color: #10b981; }
        .badge { background: rgba(99,102,241,0.2); color: #6366f1; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: bold; }
        ul { line-height: 1.8; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th, td { border: 1px solid #374151; padding: 0.75rem; text-align: left; }
        th { background: #1f2937; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <h1>EDA Pipeline Audit Report</h1>
        <p>Generated for file: <span class="badge">{{ filename }}</span></p>

        <div class="card">
            <h2>Data Quality Score: <span class="score">{{ health_score }}%</span></h2>
            <p><strong>Original Rows:</strong> {{ before_rows }} | <strong>Processed Rows:</strong> {{ after_rows }}</p>
            <p><strong>Missing Cells Cleaned:</strong> {{ missing_cleaned }}</p>
        </div>

        <div class="card">
            <h3>Applied Pipeline Transformations</h3>
            <ul>
                {% for log in logs %}
                <li>{{ log }}</li>
                {% endfor %}
            </ul>
        </div>
    </div>
</body>
</html>
"""

def generate_csv_bytes(df: pd.DataFrame) -> bytes:
    """Step 7: Download Clean CSV generator."""
    return df.to_csv(index=False).encode('utf-8')

def generate_html_report(filename: str, health_score: int, before_rows: int, after_rows: int, missing_cleaned: int, logs: List[str]) -> str:
    """Step 8: Download Report generator."""
    template = Template(HTML_REPORT_TEMPLATE)
    return template.render(
        filename=filename,
        health_score=health_score,
        before_rows=before_rows,
        after_rows=after_rows,
        missing_cleaned=missing_cleaned,
        logs=logs
    )
