# Plan

The project will be executed in a series of sequential phases to ensure a structured and robust development process.

## Phase 1: Project Scaffolding & Specification
- **Status:** Completed
- **Tasks:**
    - [x] Create the root `ai-book-chatbot` directory.
    - [x] Generate SpecKit Plus files (`constitution.md`, `specify.md`, `plan.md`, `tasks.md`).
    - [x] Create the required folder structure (`specs/`, `book/docs/`, `scripts/`).
    - [x] Create placeholder files (`.env.example`, `package.json`, `README.md`).

## Phase 2: Content Preparation
- **Status:** Completed
- **Tasks:**
    - [x] Copy the book's markdown files into the `book/docs/` directory.
    - [x] Develop the `scripts/chunk.js` script to parse and split the markdown files into manageable JSON chunks.

## Phase 3: Embedding and Storage
- **Status:** Completed
- **Tasks:**
    - [x] Request and configure API keys for Cohere and Qdrant URL.
    - [x] Install required npm packages (`cohere-node`, `@qdrant/js-client`, `dotenv`, etc.).
    - [x] Develop the `scripts/embed.js` script to:
        - Read the JSON chunks.
        - Generate embeddings for each chunk using Cohere.
        - Create a Qdrant collection with Cosine distance.
        - Upload the vectors and their corresponding text payloads to Qdrant.

## Phase 4: Retrieval and Generation
- **Status:** Completed
- **Tasks:**
    - [x] Develop the `scripts/search.js` script to embed a query and retrieve relevant chunks from Qdrant.
    - [x] Develop the `scripts/ask.js` script to:
        - Take a user question.
        - Use `search.js` to get context.
        - Construct a final prompt using the constitution, context, and question.
        - Execute a shell command to call the Gemini CLI with the prompt.
        - Output the final answer.

## Phase 5: Documentation & Finalization
- **Status:** Completed
- **Tasks:**
    - [x] Populate the `README.md` with a detailed architecture overview, setup instructions, and run commands.
    - [x] Create a final hackathon-ready explanation.
