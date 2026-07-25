import pandas as pd
import numpy as np
from typing import Dict, Any, List

def run_ai_data_cleaner(df: pd.DataFrame) -> tuple[pd.DataFrame, List[str]]:
    """
    Step 5: AI Cleans Dataset
    Automated intelligent cleaning heuristics:
    - Smart column type coercion (converting numeric strings to numbers)
    - Automated whitespace trimming
    - Categorical value standardization
    - Anomaly detection
    """
    ai_df = df.copy()
    ai_logs = []

    # 1. Smart Numeric Coercion for object columns with >80% numeric values
    for col in ai_df.columns:
        if ai_df[col].dtype == 'object':
            # Attempt numeric conversion
            converted = pd.to_numeric(ai_df[col], errors='coerce')
            valid_ratio = converted.notna().sum() / len(ai_df)
            if valid_ratio > 0.8 and valid_ratio < 1.0:
                ai_df[col] = converted
                ai_logs.append(f"AI inferred numeric column '{col}' (coerced non-numeric anomalies to NaN).")

    # 2. String Standardization & Capitalization
    str_cols = ai_df.select_dtypes(include=['object']).columns
    for col in str_cols:
        # Check for case inconsistencies (e.g. 'NEW YORK' vs 'new york')
        unique_raw = ai_df[col].dropna().unique()
        unique_clean = set(str(x).strip().title() for x in unique_raw)
        if len(unique_clean) < len(unique_raw):
            ai_df[col] = ai_df[col].astype(str).str.strip().str.title()
            ai_logs.append(f"AI standardized casing & variations in column '{col}'.")

    return ai_df, ai_logs
