export const projectDetails: Record<string, any> = {
  'Object-Detection-Distance-Estimation-for-Robotics-Navigation': {
    tags: ['YOLOv8', 'PyTorch', 'ONNX', 'TensorRT'],
    heroImage: '/images/robotics_vision_annotated.png',
    results: {
      beforeImg: '/images/robotics_vision_raw.png',
      afterImg: '/images/robotics_vision_annotated.png',
      metrics: [
        { label: "Inference Speed", value: "45 FPS" },
        { label: "mAP@0.5", value: "92.4%" },
        { label: "Depth Error", value: "±5cm" }
      ]
    },
    problem: {
      metrics: [
        { label: "Hardware Cost Savings", value: "~80%", color: "text-emerald-400", subtext: "Camera vs LiDAR stack." },
        { label: "Target Audience", value: "Robotics Engineers", color: "text-blue-400", subtext: "For autonomous navigation." },
        { label: "Objective", value: "Spatial Mapping", color: "text-purple-400", subtext: "Real-time monocular estimation." }
      ],
      note: "Data Limitation: BDD100K doesn't have native 'cone/barrier' labels; substituted 'traffic sign' as closest proxy."
    },
    dataset: {
      title: "Dataset Room",
      source: "BDD100K (Kaggle: solesensei_bdd100k)",
      rows: "100,000 frames",
      cols: "4 (Bbox, Class, Depth, Image)",
      missing: "Imbalanced",
      ratio: "Heavy (Person/Car skew)",
      featuresTitle: "Feature Importance",
      features: [
        { name: "Bounding Box Size", value: 85 },
        { name: "Camera Focal Length", value: 70 },
        { name: "Object Pixel Width", value: 45 },
        { name: "Vertical Offset", value: 30 }
      ]
    },
    experiments: {
      title: "Experiment Engine",
      list: [
        { id: 1, title: "Baseline", accuracy: "65% mAP", status: "Functional", model: "YOLOv8n", desc: "Trained on converted labels, no quantization. 15 FPS on dev GPU. Not deployment-ready." },
        { id: 2, title: "Optimized", accuracy: "92% mAP", status: "Deployed", model: "ONNX + int8", desc: "Exported and quantized via optimize.py. Achieved 45 FPS with negligible accuracy loss." }
      ]
    }
  },
  'ai-job-search': {
    tags: ['Claude', 'Agent', 'Python', 'Web Scraping'],
    problem: {
      metrics: [
        { label: "Time Saved", value: "90%", color: "text-emerald-400", subtext: "Automates tailoring & tracking." },
        { label: "Target Audience", value: "Job Seekers", color: "text-blue-400", subtext: "Career switchers & applicants." },
        { label: "Objective", value: "Automated Pipeline", color: "text-purple-400", subtext: "Sourcing → fit-scoring → tailored CV." }
      ]
    },
    dataset: {
      title: "Tool Architecture",
      source: "Agent Framework",
      rows: "N/A", cols: "N/A", missing: "N/A", ratio: "N/A",
      featuresTitle: "Pipeline Stages",
      features: [
        { name: "Scrape Job", value: 95 },
        { name: "Profile Matching", value: 90 },
        { name: "Draft CV/Letter", value: 85 },
        { name: "Export Tracker", value: 100 }
      ]
    },
    experiments: {
      title: "Workflow Engine",
      list: [
        { id: 1, title: "Manual Baseline", accuracy: "N/A", status: "Rejected", model: "Human", desc: "Hours per application, manual review and tailoring." },
        { id: 2, title: "Automated Pipeline", accuracy: "High", status: "Deployed", model: "Claude Code", desc: "Drafter-reviewer loop tailoring CV/cover letter per posting." }
      ]
    }
  },
  'Wildlife_Spread_Prediction': {
    tags: ['Geospatial ML', 'Python', 'Streamlit'],
    problem: {
      metrics: [
        { label: "Response Time", value: "Critical", color: "text-red-400", subtext: "Delays cost lives and property." },
        { label: "Target Audience", value: "Emergency Response", color: "text-blue-400", subtext: "Disaster management teams." },
        { label: "Objective", value: "Spread Prediction", color: "text-orange-400", subtext: "Predict risk zones (6-hr window)." }
      ],
      note: "Prototype currently uses synthetic data generator; designed to swap in live NASA FIRMS feed."
    },
    dataset: {
      title: "Dataset Room",
      source: "NASA FIRMS / Meteorological Data",
      rows: "Synthetic Generated", cols: "Multi-modal", missing: "N/A", ratio: "N/A",
      featuresTitle: "Feature Importance",
      features: [
        { name: "Wind Speed/Dir", value: 90 },
        { name: "NDVI / Moisture", value: 85 },
        { name: "Elevation/Slope", value: 75 },
        { name: "Drought Indices", value: 65 }
      ]
    },
    experiments: {
      title: "Experiment Engine",
      list: [
        { id: 1, title: "Baseline", accuracy: "Low", status: "Rejected", model: "Heuristic", desc: "Assumes fire keeps spreading in current direction." },
        { id: 2, title: "Optimized ML", accuracy: "High", status: "Deployed", model: "Ensemble", desc: "Full pipeline combining weather + terrain + vegetation, surfaced via dashboard." }
      ]
    }
  },
  'Twitter-Recent-Tweets-Sentiment-Analysis': {
    tags: ['Tweepy', 'NLP', 'TextBlob'],
    problem: {
      metrics: [
        { label: "Data Latency", value: "Real-time", color: "text-emerald-400", subtext: "Live public discourse." },
        { label: "Target Audience", value: "Researchers", color: "text-blue-400", subtext: "Data scientists studying opinion." },
        { label: "Objective", value: "Live Sentiment", color: "text-purple-400", subtext: "Classify live tweets." }
      ]
    },
    dataset: {
      title: "Dataset Room",
      source: "Twitter API v2 (Live Pull)",
      rows: "Dynamic", cols: "Text, Sentiment", missing: "Cleaned", ratio: "Varies",
      featuresTitle: "Methodology",
      features: [
        { name: "Polarity Scoring", value: 100 },
        { name: "Retweet Filtering", value: 80 },
        { name: "Tokenization", value: 70 },
        { name: "Lexicon Match", value: 90 }
      ]
    },
    experiments: {
      title: "Experiment Engine",
      list: [
        { id: 1, title: "Baseline", accuracy: "N/A", status: "Rejected", model: "Raw Text", desc: "Raw tweet text, no cleaning, TextBlob polarity only." },
        { id: 2, title: "Structured Output", accuracy: "Good", status: "Deployed", model: "TextBlob", desc: "Classified + exported to CSV for downstream viz. Next step: Fine-tuned transformer." }
      ]
    }
  },
  'AI_Job_Analyzer': {
    tags: ['Data Engineering', 'Python', 'Dashboards'],
    problem: {
      metrics: [
        { label: "Value", value: "High", color: "text-emerald-400", subtext: "Data-backed upskilling." },
        { label: "Target Audience", value: "Professionals", color: "text-blue-400", subtext: "Students & career planners." },
        { label: "Objective", value: "Skill Scoring", color: "text-purple-400", subtext: "Rise/decline & automation risk." }
      ]
    },
    dataset: {
      title: "Dataset Room",
      source: "Stack Overflow Developer Survey (7 yrs)",
      rows: "49,000+", cols: "Survey Responses", missing: "Imputed", ratio: "N/A",
      featuresTitle: "Feature Importance",
      features: [
        { name: "Year-over-Year Delta", value: 95 },
        { name: "Tech Stack", value: 85 },
        { name: "Salary Correlation", value: 75 },
        { name: "Job Role", value: 65 }
      ]
    },
    experiments: {
      title: "Insight Engine",
      list: [
        { id: 1, title: "Raw Ingestion", accuracy: "N/A", status: "Functional", model: "Pandas", desc: "7 years of survey CSVs merged and cleaned." },
        { id: 2, title: "Trend Scoring", accuracy: "High", status: "Deployed", model: "Statistical", desc: "YoY skill trend deltas → automation vulnerability index surfaced in dashboard." }
      ]
    }
  },
  'Multi-Document_RAG_Chatbot': {
    tags: ['LangChain', 'FAISS', 'RAG', 'LLMs'],
    problem: {
      metrics: [
        { label: "Search Speed", value: "10x", color: "text-emerald-400", subtext: "Over manual review." },
        { label: "Target Audience", value: "Developers", color: "text-blue-400", subtext: "Building internal tools." },
        { label: "Objective", value: "Multi-file QA", color: "text-purple-400", subtext: "Across PDFs/CSVs with attribution." }
      ]
    },
    dataset: {
      title: "Dataset Room",
      source: "User Uploads (Sample: sales_data.csv)",
      rows: "1,000 (Sample)", cols: "Varies", missing: "Handled", ratio: "N/A",
      featuresTitle: "Retrieval Methods",
      features: [
        { name: "Semantic Vector Search", value: 95 },
        { name: "CSV Summarization", value: 85 },
        { name: "Page-level Attribution", value: 80 },
        { name: "Contextual Memory", value: 75 }
      ]
    },
    experiments: {
      title: "Experiment Engine",
      list: [
        { id: 1, title: "Baseline", accuracy: "Poor", status: "Rejected", model: "Naive Vector", desc: "Naive per-file-type vector search, no conversation memory." },
        { id: 2, title: "Optimized RAG", accuracy: "High", status: "Deployed", model: "FAISS + Contextual", desc: "Unified FAISS store + contextualization chain that rewrites follow-ups before retrieval." }
      ]
    }
  },
  'AI_Business_Analyst': {
    tags: ['GPT-4', 'Pandas', 'Automated Analytics'],
    problem: {
      metrics: [
        { label: "Time to Insight", value: "<60s", color: "text-emerald-400", subtext: "Zero analyst required." },
        { label: "Target Audience", value: "Non-technical Teams", color: "text-blue-400", subtext: "Small ops teams." },
        { label: "Objective", value: "Auto-Reporting", color: "text-purple-400", subtext: "KPI dashboards & anomaly flags." }
      ]
    },
    dataset: {
      title: "Dataset Room",
      source: "User Uploads (Arbitrary CSV/Excel)",
      rows: "Dynamic", cols: "Adapts to Schema", missing: "Auto-filled", ratio: "N/A",
      featuresTitle: "Pipeline Priority",
      features: [
        { name: "Anomaly Detection", value: 90 },
        { name: "KPI Calculation", value: 85 },
        { name: "LLM Narrative", value: 95 },
        { name: "Data Validation", value: 70 }
      ]
    },
    experiments: {
      title: "Experiment Engine",
      list: [
        { id: 1, title: "Manual KPI", accuracy: "N/A", status: "Rejected", model: "Standard BI", desc: "Manual KPI calculation with no narrative context." },
        { id: 2, title: "Optimized Analyst", accuracy: "High", status: "Deployed", model: "GPT-4o-mini + Z-score", desc: "Insights + anomaly detection. LLM explanations tied strictly to dataset values (no hallucinations)." }
      ]
    }
  },
  'Credit_Card_Fraud_Detection': {
    tags: ['Imbalanced ML', 'Scikit-Learn', 'Metrics'],
    problem: {
      metrics: [
        { label: "Fraud Caught", value: "Optimized", color: "text-emerald-400", subtext: "Focused on recall over accuracy." },
        { label: "Target Audience", value: "ML Practitioners", color: "text-blue-400", subtext: "Learning imbalanced classification." },
        { label: "Objective", value: "Proper Evaluation", color: "text-purple-400", subtext: "Using PR-AUC instead of accuracy." }
      ]
    },
    dataset: {
      title: "Dataset Room",
      source: "Synthetic Generator included in repo",
      rows: "100,000", cols: "Anonymized", missing: "None", ratio: "98:2 (Legit:Fraud)",
      featuresTitle: "Feature Importance",
      features: [
        { name: "Transaction Amount", value: 85 },
        { name: "Time Delta", value: 65 },
        { name: "V14 (PCA)", value: 92 },
        { name: "V4 (PCA)", value: 78 }
      ]
    },
    experiments: {
      title: "Experiment Engine",
      list: [
        { id: 1, title: "Accuracy Optimized", accuracy: "98% Acc", status: "Rejected", model: "Naive", desc: "Hits 98% accuracy while catching zero fraud (0% recall). Demonstrates why accuracy is the wrong metric." },
        { id: 2, title: "Threshold Tuned", accuracy: "High PR-AUC", status: "Deployed", model: "Balanced ML", desc: "Threshold-tuned model evaluated properly on precision/recall." }
      ]
    }
  },
  'Expression-Analysis': {
    tags: ['Computer Vision', 'CNNs', 'Real-time'],
    problem: {
      metrics: [
        { label: "Latency", value: "Low", color: "text-emerald-400", subtext: "Real-time webcam inference." },
        { label: "Target Audience", value: "HCI Researchers", color: "text-blue-400", subtext: "UX teams building emotion-aware UI." },
        { label: "Objective", value: "Emotion Classification", color: "text-purple-400", subtext: "Classify live facial expressions." }
      ]
    },
    dataset: {
      title: "Dataset Room",
      source: "FER2013",
      rows: "35,887 images", cols: "48x48 pixels", missing: "None", ratio: "Imbalanced (Disgust is rare)",
      featuresTitle: "Feature Importance",
      features: [
        { name: "Mouth Curvature", value: 90 },
        { name: "Eyebrow Angle", value: 85 },
        { name: "Eye Openness", value: 75 },
        { name: "Jaw Drop", value: 60 }
      ]
    },
    experiments: {
      title: "Experiment Engine",
      list: [
        { id: 1, title: "Baseline", accuracy: "55%", status: "Rejected", model: "Simple CNN", desc: "Struggled with subtle expressions and lighting changes." },
        { id: 2, title: "Optimized", accuracy: "72%", status: "Deployed", model: "Deep CNN (VGG-style)", desc: "Achieved robust real-time performance on edge devices." }
      ]
    }
  },
  'PoisonScope': {
    tags: ['Cybersecurity', 'MLOps', 'HuggingFace'],
    problem: {
      metrics: [
        { label: "Risk Mitigation", value: "High", color: "text-emerald-400", subtext: "Prevents deploying poisoned models." },
        { label: "Target Audience", value: "Security Engineers", color: "text-blue-400", subtext: "MLOps vetting external models." },
        { label: "Objective", value: "Model Screening", color: "text-purple-400", subtext: "Scan Hugging Face for poisoning indicators." }
      ]
    },
    dataset: {
      title: "Scan Targets",
      source: "Hugging Face Hub API (Live)",
      rows: "Dynamic API", cols: "Model Metadata", missing: "N/A", ratio: "N/A",
      featuresTitle: "Risk Indicators",
      features: [
        { name: "Suspicious Weights", value: 95 },
        { name: "Unverified Author", value: 80 },
        { name: "Dataset Anomalies", value: 85 },
        { name: "Pickle Payloads", value: 100 }
      ]
    },
    experiments: {
      title: "Experiment Engine",
      list: [
        { id: 1, title: "Single Model Scan", accuracy: "N/A", status: "Functional", model: "CLI", desc: "Queries a specific named model for vulnerabilities." },
        { id: 2, title: "Batch Search", accuracy: "N/A", status: "Deployed", model: "CLI Tool", desc: "Batch scans top search results for a given query to find safe variants." }
      ]
    }
  },
  'Bank_Data_Churn': {
    tags: ['XGBoost', 'Tabular Data', 'Finance'],
    problem: {
      metrics: [
        { label: "Retention Value", value: "High", color: "text-emerald-400", subtext: "Preventing customer drop-off." },
        { label: "Target Audience", value: "Retail Banking", color: "text-blue-400", subtext: "Customer retention teams." },
        { label: "Objective", value: "Churn Prediction", color: "text-purple-400", subtext: "Identify at-risk accounts proactively." }
      ]
    },
    dataset: {
      title: "Dataset Room",
      source: "Kaggle Churn Modelling Dataset",
      rows: "10,000", cols: "14 variables", missing: "Minimal", ratio: "Imbalanced",
      featuresTitle: "Feature Importance",
      features: [
        { name: "Age", value: 85 },
        { name: "NumOfProducts", value: 72 },
        { name: "Balance", value: 64 },
        { name: "IsActiveMember", value: 55 }
      ]
    },
    experiments: {
      title: "Experiment Engine",
      list: [
        { id: 1, title: "Logistic Regression", accuracy: "79%", status: "Rejected", model: "LogReg", desc: "Failed to capture non-linear relationships." },
        { id: 2, title: "XGBoost", accuracy: "86%", status: "Deployed", model: "XGBoost", desc: "Successfully identified complex interaction effects leading to churn." }
      ]
    }
  }
};

export const getProjectDetail = (repoName: string) => {
  return projectDetails[repoName] || {
    tags: ['Python', 'Data Science'],
    problem: {
      metrics: [
        { label: "Business Value", value: "High", color: "text-emerald-400", subtext: "Critical operational improvement." },
        { label: "Target Audience", value: "Enterprise", color: "text-blue-400", subtext: "B2B and Internal." },
        { label: "Objective", value: "Optimization", color: "text-purple-400", subtext: "Scaling efficiency." }
      ]
    },
    dataset: {
      title: "Dataset Room",
      source: "Custom Dataset",
      rows: "Custom", cols: "Varies", missing: "Minimal", ratio: "Balanced",
      featuresTitle: "Feature Importance",
      features: [
        { name: "Feature A", value: 80 },
        { name: "Feature B", value: 65 },
        { name: "Feature C", value: 45 }
      ]
    },
    experiments: {
      title: "Experiment Engine",
      list: [
        { id: 1, title: "Baseline", accuracy: "70%", status: "Rejected", model: "Standard", desc: "Initial tests showed promise." },
        { id: 2, title: "Optimized", accuracy: "90%", status: "Deployed", model: "Advanced ML", desc: "Achieved target metrics." }
      ]
    }
  };
};
