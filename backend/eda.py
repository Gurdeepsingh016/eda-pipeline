import pandas as pd
import numpy as np
from typing import Dict, Any

def generate_eda_profile(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Step 6: EDA Generation engine.
    Calculates summary statistics, missingness, correlation matrix, and health scores.
    """
    numeric_df = df.select_dtypes(include=[np.number])
    corr_matrix = {}
    if not numeric_df.empty and numeric_df.shape[1] > 1:
        corr = numeric_df.corr().fillna(0)
        corr_matrix = corr.round(2).to_dict()

    summary_stats = {}
    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            summary_stats[col] = {
                "mean": round(float(df[col].mean()), 2),
                "std": round(float(df[col].std()), 2) if len(df[col]) > 1 else 0,
                "min": round(float(df[col].min()), 2),
                "max": round(float(df[col].max()), 2),
                "median": round(float(df[col].median()), 2)
            }

    # Health score calculation
    total_cells = df.size if df.size > 0 else 1
    missing_cells = df.isna().sum().sum()
    dupes = df.duplicated().sum()

    missing_penalty = (missing_cells / total_cells) * 50
    dupe_penalty = (dupes / len(df)) * 30 if len(df) > 0 else 0
    health_score = max(0, min(100, int(100 - missing_penalty - dupe_penalty)))

    return {
        "columns": list(df.columns),
        "correlation": corr_matrix,
        "summary_stats": summary_stats,
        "health_score": health_score
    }
