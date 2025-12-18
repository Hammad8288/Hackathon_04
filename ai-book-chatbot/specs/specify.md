# Specification

## 1. Project Goal
To build a production-ready, book-based AI chatbot that answers user questions based solely on the content of a given set of markdown documents.

## 2. Core Technologies
- **LLM:** Gemini CLI (used for final answer generation).
- **Embeddings Model:** Cohere's `embed-english-v3.0`.
- **Vector Database:** Qdrant, using Cosine distance for similarity search.
- **Backend/Scripting:** Node.js.
- **Methodology:** SpecKit Plus.

## 3. Key Features
- **Retrieval-Augmented Generation (RAG):** The system will find relevant text chunks from the book before generating an answer.
- **Grounded Responses:** Answers are strictly based on the retrieved text chunks, enforced by a constitution.
- **API Management:** Securely handles API keys for Cohere and Qdrant via environment variables.
- **Modular Scripts:** The workflow is broken down into clear, executable scripts for chunking, embedding, searching, and asking.

## 4. User Interaction Flow
1. A user asks a question via the command line.
2. The `ask.js` script orchestrates the process.
3. The user's question is embedded into a vector using Cohere.
4. Qdrant searches for the most relevant text chunk vectors from the book.
5. The retrieved text chunks, the user's question, and the system's constitution are formatted into a prompt.
6. This prompt is passed to the Gemini CLI.
7. The Gemini CLI generates a final answer, which is then displayed to the user.
