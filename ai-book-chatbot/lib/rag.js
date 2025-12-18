import { QdrantClient } from '@qdrant/js-client-rest';
import { CohereClient } from 'cohere-ai';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';
import { runGemini } from './runGemini.js'; // <-- IMPORT OUR NEW HELPER

dotenv.config({ path: '.env' });

const { QDRANT_URL, COHERE_API_KEY, QDRANT_API_KEY } = process.env;

console.log('QDRANT_URL:', QDRANT_URL ? 'Loaded' : 'NOT LOADED');
console.log('COHERE_API_KEY:', COHERE_API_KEY ? 'Loaded' : 'NOT LOADED');
console.log('QDRANT_API_KEY:', QDRANT_API_KEY ? 'Loaded' : 'NOT LOADED');

if (!QDRANT_URL || !COHERE_API_KEY) {
  throw new Error('Missing QDRANT_URL or COHERE_API_KEY in .env file.');
}

const qdrantClient = new QdrantClient({
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
});
const cohereClient = new CohereClient({ token: COHERE_API_KEY });

const COLLECTION_NAME = 'book_chunks';
const EMBEDDING_MODEL = 'embed-english-v3.0';
const TOP_K = 5;

/**
 * Searches for relevant text chunks in Qdrant based on a query.
 * @param {string} query - The user's question.
 * @returns {Promise<string[]>} - A promise that resolves to an array of relevant text chunks.
 */
export async function searchContext(query) {
  if (!query) {
    return [];
  }
  const { embeddings } = await cohereClient.embed({
    texts: [query],
    model: EMBEDDING_MODEL,
    inputType: 'search_query',
  });
  const queryVector = embeddings[0];
  const searchResult = await qdrantClient.search(COLLECTION_NAME, {
    vector: queryVector,
    limit: TOP_K,
    with_payload: true,
  });
  return searchResult.map((hit) => hit.payload.text);
}

/**
 * Generates an answer using the Gemini CLI.
 * @param {string} userQuestion - The user's question.
 * @param {string[]} retrievedContext - An array of relevant text chunks.
 * @returns {Promise<string>} - A promise that resolves to the generated answer.
 */
export async function generateAnswer(userQuestion, retrievedContext) {
  // Reading the constitution file needs a full path from the project root
  const constitution = await readFile(
    'specs/constitution.md',
    'utf-8'
  );

  const contextString =
    retrievedContext.length > 0
      ? retrievedContext.join('\n\n')
      : 'No specific relevant content found in the book.';

  const fullPrompt = `
    You are an AI assistant designed to answer questions ONLY from the provided book content.
    Here are the rules you MUST follow (the Constitution):
    ${constitution}

    Here is the relevant book content:
    ${contextString}

    Based on the above book content, answer the following question:
    ${userQuestion}

    If the answer is not covered in the provided book content, respond with: "This is not covered in the book."
  `;

  try {
    console.log('Sending prompt to Gemini CLI...');
    // Use the robust helper function instead of calling exec/spawn directly
    const answer = await runGemini(fullPrompt);
    console.log('Received answer from Gemini CLI.');
    return answer;
  } catch (error) {
    console.error('Error in generateAnswer:', error);
    // Re-throw the original error to be caught by the API handler
    throw error;
  }
}