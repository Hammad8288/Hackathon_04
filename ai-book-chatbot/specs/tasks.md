# Tasks

- [x] **Phase 1: Project Scaffolding & Specification**
    - [x] Create `ai-book-chatbot` directory structure.
    - [x] Generate `specs/constitution.md`.
    - [x] Generate `specs/specify.md`.
    - [x] Generate `specs/plan.md`.
    - [x] Generate `specs/tasks.md`.

- [x] **Phase 2: Content Preparation & Scripting**
    - [x] Create `book/docs` and copy source markdown files.
    - [x] Create `scripts` directory.
    - [x] Create `package.json` and define dependencies.
    - [x] Create `.env.example`.
    - [x] Create `README.md`.
    - [x] Implement `scripts/chunk.js`.

- [x] **Phase 3: Vectorization**
    - [x] Prompt user for API keys (`COHERE_API_KEY`, `QDRANT_URL`).
    - [x] Create `.env` file with provided keys.
    - [x] Implement `scripts/embed.js` to vectorize and store chunks in Qdrant.

- [x] **Phase 4: RAG Implementation**
    - [x] Implement `scripts/search.js` for retrieving relevant content.
    - [x] Implement `scripts/ask.js` to orchestrate search and final answer generation with Gemini CLI.

- [x] **Phase 5: Documentation**
    - [x] Write comprehensive `README.md` with usage instructions.
    - [x] Prepare architecture overview.
    - [x] Prepare hackathon-ready explanation.
