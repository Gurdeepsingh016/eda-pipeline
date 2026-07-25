import io
import pandas as pd
from typing import Dict, Any

def parse_and_validate_csv(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Step 1: Upload CSV & Data Preview Parser
    Parses raw CSV bytes into pandas DataFrame and computes schema metadata.
    """
    try:
        df = pd.read_csv(io.BytesIO(file_bytes))
    except Exception as e:
        raise ValueError(f"Failed to parse CSV file: {str(e)}")

    rows, cols = df.shape
    total_cells = rows * cols if cols > 0 else 1
    missing_count = int(df.isna().sum().sum())
    duplicates = int(df.duplicated().sum())

    column_info = []
    for col in df.columns:
        is_num = pd.api.types.is_numeric_dtype(df[col])
        column_info.append({
            "name": col,
            "type": "Numeric" if is_num else "Categorical",
            "nulls": int(df[col].isna().sum()),
            "unique": int(df[col].nunique())
        })

    return {
        "filename": filename,
        "rows": rows,
        "columns": list(df.columns),
        "column_info": column_info,
        "missing_count": missing_count,
        "missing_percentage": round((missing_count / total_cells) * 100, 2),
        "duplicates": duplicates,
        "preview_data": df.head(20).to_dict(orient="records")
    }
