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
  const pathToSavedState = path.join(filePath, '.lightbox', 'state.json');
  let parsedState: any = {};

  if (existsSync(pathToSavedState)) {
    const stateContents = await fs.readFile(pathToSavedState, {
      encoding: 'utf-8',
    });
    parsedState = JSON.parse(stateContents);
  }
  const parsedTree = JSON.parse(contents);
  return { cdkApp: parsedTree, ...parsedState };
};

export default openWorkbench;
