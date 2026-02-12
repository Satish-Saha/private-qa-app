# Private Knowledge Q&A Mini Workspace

A professional full-stack Next.js application for secure, local document management and knowledge retrieval.

## 🚀 Core Features
- **Smart Document Upload**: Batch upload `.txt` files to your private library.
- **Local Knowledge Retrieval**: Search internal documents using a custom-built similarity engine.
- **NO EXTERNAL AI**: Your data stays private. No LLM APIs (OpenAI/Gemini) are used.
- **Source Attribution**: Every answer shows the filename and the exact paragraph source.
- **System Health**: Dedicated status page for monitoring API and Database connectivity.
- **Premium UI**: Responsive, glassmorphic design built with Tailwind CSS and Framer Motion.

## 🛠 Tech Stack
- **Frontend**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS & Framer Motion
- **Backend**: Next.js API Routes (Node.js)
- **Database**: MongoDB Atlas with Mongoose

## 📦 Prerequisites
- Node.js 18.0 or higher
- MongoDB Atlas (or a local MongoDB instance)

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

## 📡 Health Monitoring
Visit `/status` inside the application to see real-time health checks for the Backend, MongoDB connection, and search engine readiness.

## 🧠 Similarity Search Approach
1. **Paragraph Chunking**: Documents are split into logical chunks based on double newlines.
2. **Keyword Mapping**: Questions are tokenized and common "stop words" are removed.
3. **Scoring**: A similarity score is calculated based on keyword overlap and exact phrase matching.
4. **Retrieval**: The highest-scoring chunk is returned as the primary answer with full metadata.

## 📝 Document Information
- **AI_NOTES.md**: Technical details of AI involvement and search engine implementation.
- **ABOUTME.md**: Developer profile and experience.
- **PROMPTS_USED.md**: The prompts driving the creation of this workspace.
