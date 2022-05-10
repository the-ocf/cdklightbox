import fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';

export const openWorkbench = async (filePath: string) => {
  const pathToTree = path.join(filePath, 'cdk.out', 'tree.json');
  if (!existsSync(pathToTree)) {
    throw new Error(
      "The CDK App doesn't exist yet. Please synthesize your app first."
    );
  }
  const contents = await fs.readFile(pathToTree, { encoding: 'utf-8' });
  return JSON.parse(contents);
};

export default openWorkbench;
