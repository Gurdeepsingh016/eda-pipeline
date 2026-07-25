# EDA Pipeline — AI-Powered Data Cleaning & Analysis

> **A modern, full-stack Exploratory Data Analysis (EDA) tool** with AI-assisted cleaning, interactive charts, and one-click CSV export. Built with React + Vite and a Python FastAPI backend.

![EDA Pipeline](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite) ![Recharts](https://img.shields.io/badge/Recharts-2-green) ![License](https://img.shields.io/badge/License-MIT-orange)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📤 **CSV Upload** | Drag & drop or click to upload any CSV dataset |
| 🧠 **AI Auto-Clean** | Missing value imputation, outlier capping, duplicate removal |
| 📊 **EDA Charts** | Bar charts, donut/pie charts with custom color palettes |
| 🗂️ **Data Preview** | Paginated table with null-cell highlighting |
| 📋 **Quality Reports** | Health score, transformation log, downloadable HTML report |
| 💾 **Bulk CSV Export** | Download cleaned, raw, and all sample datasets at once |
| 🎨 **Light Theme** | Premium glassmorphism UI with indigo accent palette |

---

## 🚀 Live Demo

> Deployed on **Vercel** — [https://your-app-name.vercel.app](https://your-app-name.vercel.app)  
> *(Update this link after deployment)*

---

## 🛠️ Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/eda-pipeline.git
cd eda-pipeline

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 📦 Project Structure

```
EDA-Pipeline/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Upload.jsx       # CSV upload & sample loader
│   │   │   ├── Dashboard.jsx    # Data preview & stats
│   │   │   ├── Cleaning.jsx     # Cleaning options panel
│   │   │   ├── Charts.jsx       # EDA visualizations
│   │   │   ├── Reports.jsx      # Quality report & downloads
│   │   │   └── Settings.jsx     # App settings
│   │   ├── App.jsx          # Main routing & state
│   │   └── index.css        # Global light theme styles
│   ├── index.html
│   └── package.json
├── backend/                # Python FastAPI backend (optional)
├── datasets/               # Sample CSV datasets
├── vercel.json             # Vercel deployment config
├── .gitignore
└── README.md
```

---

## ☁️ Deployment

### Deploy to Vercel (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Vercel auto-detects settings from `vercel.json`
5. Click **Deploy** 🚀

### Deploy to Netlify

1. Go to [netlify.com](https://www.netlify.com) → **New site from Git**
2. Connect your GitHub repo
3. Set:
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Publish directory**: `frontend/dist`
4. Click **Deploy**

---

## 🧪 Sample Datasets Included

| Dataset | Rows | Issues |
|---|---|---|
| Customer Churn Dataset | ~10 | Missing ages, duplicate IDs |
| Retail Sales Dataset | ~7 | Null quantities, inconsistent store names |
| Large E-Commerce Dataset | 3,400+ | 25%+ missing values, 400+ duplicates, outliers |

---

## 📄 License

MIT © 2025 — Feel free to use and modify.
