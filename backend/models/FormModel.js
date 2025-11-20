import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, '..', 'data', 'responses.json');

// Ensure file exists
if (!fs.existsSync(dataFilePath)) {
  fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
  console.log('Created data folder and responses.json');
}

// Read all responses
export const getAllResponses = () => {
  const rawData = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(rawData);
};

// Save a new response
export const saveResponse = (response) => {
  const responses = getAllResponses();
  const newResponse = { ...response, id: Date.now() };
  responses.push(newResponse);
  fs.writeFileSync(dataFilePath, JSON.stringify(responses, null, 2));
  return newResponse;
};
