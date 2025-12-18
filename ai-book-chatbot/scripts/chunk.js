import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// The directory where the book's markdown files are stored
const DOCS_PATH = 'book/docs';
// The output file for the structured data
const OUTPUT_FILE = 'chunks.json';
// The root directory of the project, to resolve absolute paths
const PROJECT_ROOT = process.cwd();

/**
 * Splits a text into chunks based on double newlines (paragraphs).
 * Filters out very short or empty chunks.
 * @param {string} text - The text content of a file.
 * @param {string} filePath - The path of the file being processed.
 * @returns {Array<{id: string, text: string, source: string}>} - An array of chunk objects.
 */
function chunkText(text, filePath) {
  const chunks = text
    .split(/\n\n+/) // Split by one or more double newlines
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 50); // Filter out very short chunks (e.g., just a title)

  return chunks.map((chunk) => ({
    id: uuidv4(),
    text: chunk,
    source: path.basename(filePath),
  }));
}

/**
 * Main function to find markdown files, read them, chunk them, and save to a JSON file.
 */
async function main() {
  console.log('Starting to chunk markdown files...');
  const markdownFiles = await glob(`${DOCS_PATH}/**/*.md`);

  if (markdownFiles.length === 0) {
    console.error(`No markdown files found in '${DOCS_PATH}'. Please add your book files.`);
    return;
  }
  
  console.log(`Found ${markdownFiles.length} markdown file(s).`);

  let allChunks = [];

  for (const filePath of markdownFiles) {
    try {
      const absolutePath = path.resolve(PROJECT_ROOT, filePath);
      const content = await readFile(absolutePath, 'utf-8');
      const fileChunks = chunkText(content, filePath);
      allChunks = allChunks.concat(fileChunks);
      console.log(`- Chunked '${filePath}' into ${fileChunks.length} chunks.`);
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  }

  try {
    const outputPath = path.resolve(PROJECT_ROOT, OUTPUT_FILE);
    await writeFile(outputPath, JSON.stringify(allChunks, null, 2));
    console.log(`\nSuccessfully created ${allChunks.length} chunks in '${OUTPUT_FILE}'.`);
  } catch (error) {
    console.error(`Error writing to output file ${OUTPUT_FILE}:`, error);
  }
}

main();
