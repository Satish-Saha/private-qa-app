# Private Knowledge Q&A Mini Workspace (RAG Based)

A professional full-stack Next.js application that leverages a **Retrieval-Augmented Generation (RAG)** pipeline to provide intelligent answers from your private documents.

## 🚀 Core Features
- **Intelligent Q&A**: Powered by **Google Gemini 2.5 Flash** for high-quality, context-aware responses.
- **RAG Architecture**: Combines vector-based semantic search with LLM reasoning to ensure accuracy.
- **Remote Embeddings**: Uses Google's `text-embedding-004` model for high-speed, 768-dimensional semantic vectors.
- **Hybrid Storage**: MongoDB for persistent records, and an optimized in-memory vector store for lightning-fast retrieval.
- **Smart Data Handling**: Auto-chunking (500 chars with 50-char overlap) for optimal context window management.
- **Premium UI**: Responsive, minimal glassmorphic design built with Tailwind CSS, Framer Motion, and React Markdown.
- **Source Attribution**: Every answer is backed by "Verification Chunks" showing the exact snippets used for the answer.

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **AI/ML**: Google Gemini API (`2.5-flash` for answers, `text-embedding-004` for vectors)
- **Styling**: Tailwind CSS & Framer Motion
- **Database**: MongoDB Atlas with Mongoose
- **Status Monitoring**: Custom health check system for the backend, DB, and AI readiness.

## 📦 Prerequisites
- Node.js 18.0 or higher
- MongoDB Atlas (or a local MongoDB instance)
- Google AI Studio API Key (for Gemini)

## ⚙️ Installation & Setup

1. **Clone the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env.local` file in the root and add:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_google_ai_studio_api_key
   ```
4. **Start Development Server**:
   ```bash
   npm run dev
   ```
5. **Visit the app**: [http://localhost:3000](http://localhost:3000)

## 🧪 Quick Testing
I have provided two sample files in the root directory that you can use to test the RAG functionality immediately:
- **`Resume.txt`**: A sample developer profile.
- **`Notes.txt`**: Technical notes and skill descriptions.

Simply upload these via the UI, and then you can ask questions like *"What are the technical skills?"* or *"Describe the professional experience."*

## 📡 Health Monitoring
Visit `/status` to see real-time health checks for:
- **Backend**: API responsiveness.
- **Database**: MongoDB connection state.
- **Search Engine**: Index readiness and document count.

## 🧠 The RAG Pipeline
1. **Extraction**: TXT content is extracted and split into chunks with overlap to preserve context.
2. **Embedding**: Google's `text-embedding-004` model converts text into **768-dimensional** semantic vectors.
3. **Vector Store**: Chunks are stored in memory for O(1) retrieval speed.
4. **Similarity Search**: User questions are embedded and matched using **Cosine Similarity**.
5. **Generation**: The top 3 most relevant contexts are sent to Gemini with a strict "answer only using context" instruction to prevent hallucinations.

## 📝 Document Information
- **AI_NOTES.md**: Technical deep-dive into the RAG architecture and local embedding logic.
- **ABOUTME.md**: Developer profile and experience ([Satish-Saha](https://github.com/Satish-Saha)).
- **PROMPTS_USED.md**: The prompts driving the creation and upgrades of this workspace.
