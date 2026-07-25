import pandas as pd
import numpy as np
from typing import Dict, Any

def generate_chart_payloads(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Step 6: Chart Data Generator
    Computes distribution histograms, categorical bar frequencies, and boxplot stats.
    """
    distributions = {}

    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            counts, bin_edges = np.histogram(df[col].dropna(), bins=8)
            bin_data = []
            for i in range(len(counts)):
                label = f"{round(bin_edges[i], 1)} - {round(bin_edges[i+1], 1)}"
                bin_data.append({"bin": label, "count": int(counts[i])})
            distributions[col] = bin_data
        else:
            val_counts = df[col].value_counts().head(8).to_dict()
            bin_data = [{"bin": str(k), "count": int(v)} for k, v in val_counts.items()]
            distributions[col] = bin_data

    return {
        "columns": list(df.columns),
        "distributions": distributions
    }
