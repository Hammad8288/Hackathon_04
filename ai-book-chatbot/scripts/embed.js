import { QdrantClient } from '@qdrant/js-client-rest';
import { CohereClient } from 'cohere-ai';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const QDRANT_URL = process.env.QDRANT_URL;
const COHERE_API_KEY = process.env.COHERE_API_KEY;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

if (!QDRANT_URL || !COHERE_API_KEY || !QDRANT_API_KEY) {
  console.error('Missing QDRANT_URL, COHERE_API_KEY, or QDRANT_API_KEY in .env file.');
  process.exit(1);
}

const COLLECTION_NAME = 'book_chunks';
const CHUNKS_FILE = 'chunks.json';
const EMBEDDING_MODEL = 'embed-english-v3.0';

const qdrantClient = new QdrantClient({ 
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
});
const cohereClient = new CohereClient({
  token: COHERE_API_KEY,
});

async function ensureCollection() {
  const collections = await qdrantClient.getCollections();
  const collectionExists = collections.collections.some(
    (c) => c.name === COLLECTION_NAME
  );

  if (!collectionExists) {
    console.log(`Creating collection '${COLLECTION_NAME}'...`);
    await qdrantClient.createCollection(COLLECTION_NAME, {
      vectors: { size: 1024, distance: 'Cosine' }, // Cohere embed-english-v3.0 has 1024 dimensions
    });
    console.log(`Collection '${COLLECTION_NAME}' created.`);
  } else {
    console.log(`Collection '${COLLECTION_NAME}' already exists.`);
  }
}

async function embedAndUploadChunks() {
  console.log('Loading chunks from file...');
  const chunksPath = path.resolve(process.cwd(), CHUNKS_FILE);
  const chunksData = await readFile(chunksPath, 'utf-8');
  const chunks = JSON.parse(chunksData);

  console.log(`Found ${chunks.length} chunks. Generating embeddings...`);

  const texts = chunks.map((chunk) => chunk.text);

  // Cohere allows batching for embeddings
  const { embeddings } = await cohereClient.embed({
    texts: texts,
    model: EMBEDDING_MODEL,
    inputType: 'search_document',
  });

  const points = chunks.map((chunk, index) => ({
    id: chunk.id,
    vector: embeddings[index],
    payload: {
      text: chunk.text,
      source: chunk.source,
      // Add any other metadata you deem useful
    },
  }));

  console.log(`Uploading ${points.length} points to Qdrant...`);
  await qdrantClient.upsert(COLLECTION_NAME, {
    wait: true,
    batch: {
      ids: points.map(p => p.id),
      vectors: points.map(p => p.vector),
      payloads: points.map(p => p.payload),
    },
  });

  console.log('Embeddings uploaded to Qdrant successfully!');
}

async function main() {
  try {
    await ensureCollection();
    await embedAndUploadChunks();
  } catch (error) {
    console.error('Error during embedding and uploading:', error);
    process.exit(1);
  }
}

main();
