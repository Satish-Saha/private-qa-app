# Prompts Used During Development

1. "Build a complete full-stack web application for: Project A: Private Knowledge Q&A (Mini Workspace). Tech Stack: Next.js (App Router), JavaScript, Tailwind CSS, MongoDB Atlas."
2. "Implement a local similarity search logic using paragraph chunking and keyword overlap scoring."
3. "Enhance the UI with a professional glass-card design and toast notifications for user feedback."
4. "Add a status page at /status and an API at /api/status showing health checks for Backend and Database."
5. "Upgrade the application to a True RAG system:
    - Use Google Gemini `gemini-embedding-001` for embeddings to improve vector quality.
    - Implement 300-char chunking with 20-char overlap.
    - Implement in-memory vector storage and cosine similarity.
    - Integrate Google Gemini Chat Completion API for final answer generation based ONLY on retrieved context."
6. "Implement Google's `taskType` (RETRIEVAL_QUERY and RETRIEVAL_DOCUMENT) to optimize search precision."
7. "Add 'Friendly Error Masking' for API Quota (429) errors to ensure professional UI messaging during rate limits."
8. "Refactor chunking engine to use Paragraph-First logic, ensuring logical sections remain intact for higher retrieval accuracy."
9. "Enhance Source Attribution UI with similarity match percentages and increased context depth (Top-5 chunks)."
