import pandas as pd
import numpy as np
from typing import Dict, Any, List

def clean_dataset(df: pd.DataFrame, params: Dict[str, Any]) -> tuple[pd.DataFrame, List[str]]:
    """
    Step 3 & 4: Cleaning Options & Process Data execution engine.
    Applies imputation, deduplication, outlier capping, and text normalization.
    """
    cleaned_df = df.copy()
    logs = []

    # 1. Drop non-essential columns if requested
    dropped_cols = params.get("droppedColumns", [])
    if dropped_cols:
        existing_drop = [c for c in dropped_cols if c in cleaned_df.columns]
        cleaned_df.drop(columns=existing_drop, inplace=True)
        logs.append(f"Dropped {len(existing_drop)} excluded columns: {', '.join(existing_drop)}")

    # 2. Duplicate Removal
    if params.get("removeDuplicates", True):
        init_len = len(cleaned_df)
        cleaned_df.drop_duplicates(inplace=True)
        dupes_removed = init_len - len(cleaned_df)
        logs.append(f"Removed {dupes_removed} duplicate rows.")

    # 3. Missing Value Handling
    missing_strat = params.get("missingStrategy", "mean")
    missing_count_before = int(cleaned_df.isna().sum().sum())

    if missing_strat == "drop":
        cleaned_df.dropna(inplace=True)
        logs.append("Dropped rows containing missing (NaN) values.")
    else:
        for col in cleaned_df.columns:
            if cleaned_df[col].isna().sum() > 0:
                if pd.api.types.is_numeric_dtype(cleaned_df[col]):
                    if missing_strat == "mean":
                        fill_val = cleaned_df[col].mean()
                        cleaned_df[col].fillna(fill_val, inplace=True)
                    elif missing_strat == "median":
                        fill_val = cleaned_df[col].median()
                        cleaned_df[col].fillna(fill_val, inplace=True)
                    elif missing_strat == "fill_zero":
                        cleaned_df[col].fillna(0, inplace=True)
                else:
                    mode_val = cleaned_df[col].mode()
                    fill_val = mode_val[0] if not mode_val.empty else "Unknown"
                    cleaned_df[col].fillna(fill_val, inplace=True)
        logs.append(f"Imputed missing values using strategy: '{missing_strat.upper()}'.")

    # 4. Outlier Handling (IQR Capping)
    outlier_strat = params.get("outlierStrategy", "iqr_clip")
    if outlier_strat == "iqr_clip":
        numeric_cols = cleaned_df.select_dtypes(include=[np.number]).columns
        capped_count = 0
        for col in numeric_cols:
            q1 = cleaned_df[col].quantile(0.25)
            q3 = cleaned_df[col].quantile(0.75)
            iqr = q3 - q1
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            
            outliers = (cleaned_df[col] < lower_bound) | (cleaned_df[col] > upper_bound)
            capped_count += int(outliers.sum())
            cleaned_df[col] = np.clip(cleaned_df[col], lower_bound, upper_bound)
        logs.append(f"Capped {capped_count} outlier values using Interquartile Range (IQR).")

    # 5. Text Normalization
    if params.get("normalizeStrings", True):
        str_cols = cleaned_df.select_dtypes(include=['object', 'string']).columns
        for col in str_cols:
            cleaned_df[col] = cleaned_df[col].astype(str).str.strip()
        logs.append("Normalized string fields (trimmed extra whitespaces).")

    return cleaned_df, logs
