import { searchContext, generateAnswer } from '../../lib/rag.js';

export default async function handler(req, res) {
  // Handle CORS and preflight requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ensure we only handle POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required and must be a string.' });
  }

  try {
    // 1. Retrieve relevant context
    console.log(`API: Searching context for question: "${question}"`);
    const context = await searchContext(question);

    // 2. Generate the answer using our robust RAG pipeline
    console.log('API: Generating answer with Gemini...');
    const answer = await generateAnswer(question, context);
    console.log(`API: Successfully got answer.`);

    // 3. Send the successful response. This is the FINAL step.
    // Do not return anything from the handler after this.
    res.status(200).json({ answer });

  } catch (error) {
    console.error('API Error:', error.message);

    // 4. Send an error response. This is also a FINAL step.
    res.status(500).json({ error: 'Failed to get an answer from the AI.' });
  }
}