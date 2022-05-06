import fs from 'fs/promises';
import * as path from 'path';

export const openWorkbench = async (filePath: string) => {
  const contents = await fs.readFile(
    path.join(filePath, '.workbench', 'workbench.json'),
    { encoding: 'utf-8' }
  );
  return JSON.parse(contents);
};

export default openWorkbench;
