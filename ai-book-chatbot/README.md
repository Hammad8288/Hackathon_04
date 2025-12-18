# AI Book Chatbot

This project is an AI chatbot that answers questions based solely on the content of a provided book. It utilizes a Retrieval-Augmented Generation (RAG) architecture to ensure answers are grounded in the source material, preventing hallucinations.

## Architecture Overview (with Web UI)

The application now features a full-stack architecture with a web-based user interface.

1.  **Frontend (Next.js & React):** A user-friendly chat interface built with React and Next.js allows users to interact with the chatbot in a browser.
2.  **Backend API (`/api/ask`):** A Next.js API route serves as the backend. It receives questions from the frontend.
3.  **RAG Core (`/lib/rag.js`):** The core retrieval and generation logic is modularized in `lib/rag.js`. When the API receives a question, it calls this module to:
    a.  **Embed the query** using Cohere's `embed-english-v3.0` model.
    b.  **Search Qdrant** to retrieve the most relevant text chunks from the book.
4.  **Language Model (Gemini CLI):** The RAG module constructs a detailed prompt containing the user's question, retrieved context, and the project's **Constitution**. It then executes the `gemini` command-line tool to generate a grounded, safe answer.
5.  **Data Preparation (`scripts/`):** The original scripts for `chunk.js` and `embed.js` are still used for the one-time setup of preparing the book content and populating the Qdrant vector database.

**Flow Summary:**
User in Browser -> React UI -> Next.js API (`/api/ask`) -> RAG Core (Embed Query -> Qdrant Search) -> Construct Prompt -> Gemini CLI -> Answer to API -> Answer to UI.

## Setup & Installation

1.  **Clone the Repository:**
    ```bash
    git clone <repository_url>
    cd ai-book-chatbot
    ```
2.  **Install Node.js Dependencies:**
    This will install all necessary packages, including Next.js, React, Cohere, and Qdrant clients.
    ```bash
    npm install
    ```
3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the `ai-book-chatbot` directory with your Cohere API Key and Qdrant URL.
    ```
    QDRANT_URL=https://<your-qdrant-instance-url>
    COHERE_API_KEY=your_cohere_api_key_here
    ```
    *   **Qdrant:** You can run Qdrant locally using Docker or use a cloud instance.
    *   **Cohere:** Obtain an API key from the Cohere website.
    *   **Gemini CLI:** Ensure you have the Gemini CLI installed and configured.

4.  **Add Your Book Content:**
    Place your markdown files (e.g., `.md`) into the `book/docs/` directory.

## Usage

Follow these steps to prepare your data and run the chatbot web application.

### Step 1: Prepare the Data (One-Time Setup)

First, you need to process your book content and load it into the vector database.

1.  **Chunk Your Book Content:**
    This script reads your markdown files, splits them into chunks, and saves them to `chunks.json`.
    ```bash
    npm run chunk
    ```

2.  **Generate Embeddings and Upload to Qdrant:**
    This script takes the `chunks.json` file, generates embeddings, and uploads them to your Qdrant instance.
    ```bash
    npm run embed
    ```

### Step 2: Run the Web Application

Once your data is in Qdrant, you can start the web application.

1.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
2.  **Open the Chatbot:**
    Open your web browser and navigate to `http://localhost:3000`. You should see the chat interface, ready to answer your questions.

## Hackathon-Ready Explanation

This chatbot demonstrates a complete, full-stack RAG system. It provides a user-friendly web interface and is designed for clear, grounded answers, making it ideal for information retrieval from specific knowledge bases like books or documentation. The modular design, strict adherence to a "Constitution" for answer generation, and use of leading AI services (Cohere, Qdrant, Gemini) make it a robust and scalable solution. Its core strength lies in minimizing hallucinations by strictly enforcing answers to come from provided content—a critical feature for reliable AI applications.