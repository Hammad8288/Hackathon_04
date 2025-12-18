# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator. It now includes an AI chatbot powered by Cohere, Qdrant, and Gemini.

## Installation

```bash
# Install Docusaurus dependencies
yarn

# Navigate to the chatbot backend directory
cd ai-book-chatbot
# Install chatbot backend dependencies
npm install
# Navigate back to the root directory
cd ..
```

## Local Development (with AI Chatbot)

To run the Docusaurus website with the integrated AI chatbot, you need to start two separate servers:

### 1. Start the Chatbot Backend (Next.js API)

This server handles the AI logic (embeddings, Qdrant search, Gemini LLM calls).

*   **Open a new terminal window.**
*   Navigate to the `ai-book-chatbot` directory:
    ```bash
    cd ai-book-chatbot
    ```
*   Start the backend:
    ```bash
    npm run dev:backend
    ```
    This will start the backend on `http://localhost:3001`. Keep this terminal running.

### 2. Start the Docusaurus Frontend

This server displays your book content and hosts the chat widget.

*   **Open another new terminal window.**
*   Navigate to the root of your project (where this `README.md` is located).
*   Start the Docusaurus development server:
    ```bash
    yarn start
    ```
    This will typically open your browser to `http://localhost:3000`.

You should now see your Docusaurus website with a floating chat button on the bottom right. Click it to open the chatbot!

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service. Note that for a production deployment of the full application, you would need to deploy the `ai-book-chatbot` backend separately as a Node.js/Next.js server.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash

GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
