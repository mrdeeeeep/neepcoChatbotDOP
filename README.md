# NEEPCO DOP Policy Chatbot 🤖

This repository contains the code for a **Retrieval-Augmented Generation (RAG)** chatbot designed to help users navigate and understand the **Delegation of Power (DOP)** policies of **NEEPCO (North Eastern Electric Power Corporation Limited)**.

🧪 [Live Demo (Frontend)](https://neepcodop.netlify.app/) | 🛠️ [Backend on Hugging Face Spaces](https://huggingface.co/spaces/Kalpokoch/ChatbotDemo)

---

## 📚 Table of Contents

1. [Project Overview](#1-project-overview)  
2. [Technologies Used](#2-technologies-used)  
3. [Data & Context](#3-data--context)  
4. [Technical Approach & Features](#4-technical-approach--features)  
5. [Setup & Running Locally](#5-setup--running-locally)  
6. [Deployment to Hugging Face Spaces](#6-deployment-to-hugging-face-spaces)  
7. [Known Limitations & Challenges](#7-known-limitations--challenges)  
8. [Future Enhancements](#8-future-enhancements)

---

## 1. Project Overview

The core purpose of this chatbot is to provide **quick, accurate, and reference-backed answers** to questions about:

- Financial delegation
- Approval authorities
- Operational procedures

This reduces the manual effort and ensures consistent policy compliance within NEEPCO.

---

## 2. Technologies Used

| Component          | Technology                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| LLM               | `Kalpokoch/FinetunedQuantizedTinyLama` (TinyLlama Q4_K_M, GGUF format)     |
| Embedding Model   | [`BAAI/bge-large-en-v1.5`](https://huggingface.co/BAAI/bge-large-en-v1.5)  |
| Vector DB         | ChromaDB                                                                    |
| Serving           | `llama-cpp-python`                                                          |
| Web Framework     | FastAPI                                                                     |
| Containerization  | Docker                                                                      |
| Hosting (Backend) | [Hugging Face Spaces](https://huggingface.co/spaces/Kalpokoch/ChatbotDemo) |
| Hosting (Frontend)| [Netlify](https://neepcodop.netlify.app/)                                  |

---

## 3. Data & Context

### 📁 `Dataset/combined_dataset.jsonl`
- Contains real user questions and ideal answers for evaluation.
- Format: JSONL with `instruction`, `input`, `output`.

Example:
```json
{"instruction": "Who approves resignation of executives E-7 and above?", "input": "", "output": "CMD"}
```

### 📁 `Context/combined_context.jsonl`
- Structured representation of policy clauses.
- Includes: `section`, `title`, `clause`, `authority`, `extent_of_power`, `remarks`, etc.

Example:
```json
{
  "section": "II",
  "title": "Acceptance of Resignation of employees including waiver of notice period",
  "clause": 9,
  "extent_of_power": [{"Executives up to E-8": "Full Powers"}, {"Non-Executives": "Full Powers"}],
  "authority": "CMD, Director, HOP/HOD (depending on grade)"
}
```

---

## 4. Technical Approach & Features

### 🔍 Retrieval-Augmented Generation (RAG)

- **Chunking**: `create_context_chunks.py` breaks down clauses into fine-grained chunks and injects definitions (e.g., *“DOP stands for Delegation of Powers”*).
- **Semantic Search**: User queries are embedded using `bge-large-en-v1.5` and matched against ChromaDB.
- **Contextual Answering**: Retrieved chunks + question are passed to TinyLlama to generate answers.
- **Timeout Handling**: FastAPI uses `asyncio.wait_for` to limit LLM response time.
- **CPU Optimization**: `llama-cpp-python` is tuned with parameters like `n_ctx`, `n_threads`, and `n_batch`.

### ✅ Key Features

- 🔁 Retrieval-Augmented Generation for accuracy  
- 🔎 Traceable answers with policy references  
- 💬 Natural language understanding  
- 🔧 Easy updates to context by editing JSONL files  

---

## 5. Setup & Running Locally

### 🔧 Prerequisites

- Docker (recommended)  
- Python 3.11+  
- pip

### ⚙️ Steps

```bash
# Clone the repo
git clone <your-repo-url>
cd <your-repo-name>

# Prepare context chunks
python create_context_chunks.py

# Build the Docker image
docker build -t neepco-dop-chatbot .

# Run with default 30s timeout
docker run -p 7860:7860 neepco-dop-chatbot

# Run with custom timeout (e.g., 60s)
docker run -p 7860:7860 -e LLM_TIMEOUT_SECONDS=60 neepco-dop-chatbot
```

### 🌐 Access

Visit [http://localhost:7860](http://localhost:7860)

### 📡 API Endpoints

| Endpoint      | Method | Description                                |
|---------------|--------|--------------------------------------------|
| `/`           | GET    | Health check                               |
| `/chat`       | POST   | Ask a question (`{"question": "..."}`)     |
| `/feedback`   | POST   | Submit feedback on a response              |

---

## 6. Deployment to Hugging Face Spaces

1. Create a Space at [Hugging Face](https://huggingface.co/spaces)
2. Select **Docker** as the runtime
3. Make the Space **Public** or **Private** as needed
4. Connect your GitHub repository
5. Ensure `Dockerfile` and `requirements.txt` are in the root
6. (Optional) Set environment variable `LLM_TIMEOUT_SECONDS` for production control

🟢 Once deployed, your chatbot backend will be live here:  
👉 [Chatbot Backend on HF Spaces](https://huggingface.co/spaces/Kalpokoch/ChatbotDemo)

---

## 7. Known Limitations & Challenges

- 🐢 **Slow CPU Inference**: On Hugging Face free tier, inference can take 3–10+ minutes.
- ⏱️ **Timeout Management**: May be bypassed under severe CPU throttling.
- 🔍 **Retriever Precision**: Low vector similarity scores lead to vague responses.
- 🧠 **LLM Reasoning Limitations**: TinyLlama may miss subtle policy nuances or cross-chunk logic.

---

## 8. Future Enhancements

- 📐 Better Chunking: Add inline Q&A in context for stronger matches.
- 📊 Performance Logging: Track latency and system resource usage.
- 🧠 RAG Upgrades: Use query rewriting, chunk re-ranking, or multi-hop techniques.
- 🖥️ Frontend UI: Build intuitive, real-time user interface (planned).
- 🛡️ Improved Error Messaging: More precise failure/timeout explanations.
- 🚀 Model Alternatives: Explore smaller or GPU-optimized models for faster inference.

