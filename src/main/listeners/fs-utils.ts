import fs from 'fs';

export function checkIfEmpty(filePath: string) {
  if (!filePath) {
    throw new Error('Must provide a filePath, none was provided');
  }
  const results = fs.readdirSync(filePath);
  return results.length === 0;
}
