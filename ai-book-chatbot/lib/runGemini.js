import { GoogleGenerativeAI } from '@google/generative-ai';

// Get the API key from the environment variables
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}

// Create a new instance of the GoogleGenerativeAI class
const genAI = new GoogleGenerativeAI(apiKey);

// Specify the model to use
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Runs the Gemini model with a given prompt and returns the generated text.
 * @param {string} prompt The full prompt to send to the Gemini model.
 * @returns {Promise<string>} A promise that resolves with the generated text.
 */
export async function runGemini(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text.trim();
  } catch (error) {
    console.error('Error running Gemini model:', error);
    throw error;
  }
}