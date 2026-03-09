# AI Development Notes (RAG Version)

## AI Architecture
This project has been upgraded to a full **Retrieval-Augmented Generation (RAG)** pipeline.
- **Embeddings**: Powered by **Google Gemini `gemini-embedding-001`** for high-quality semantic vector generation.
- **Vector Search**: Custom cosine similarity engine computed against stored embeddings.
- **Answer Generation**: Powered by **Google Gemini 2.5 Flash** for high-quality, context-aware responses.

## Key Technical Decisions
- **Hybrid Storage**: 
  - **Documents**: Metadata and raw content are stored permanently in **MongoDB Atlas**.
  - **Chunks**: Text is split into 500-character segments with 50-character overlap.
  - **Vector Store**: Embeddings are stored in high-speed, in-memory cache for ultra-fast retrieval.
- **Prompt Engineering**: The generative step is constrained to *only* answer using the retrieved context to minimize hallucinations.
- **Cold-Start Logic**: The system automatically re-vectors and hydrates the in-memory store from MongoDB if the server restarts.

## RAG Flow Detail
1. **Extraction**: TXT content is extracted and chunked.
2. **Embedding**: Gemini API converts text chunks into semantic high-dimensional vectors.
3. **Retrieval**: User questions are embedded and matched against chunks using cosine similarity.
4. **Generation**: The top 3 contexts are injected into a Gemini system prompt to produce the final answer.
