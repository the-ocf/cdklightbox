import fs from 'fs/promises';
import path from 'path';
import * as child_process from 'child_process';
import { WorkbenchState } from '../../renderer/state';
import IpcMainEvent = Electron.IpcMainEvent;

export const workbenchStateUpdateListener = async (
  _event: IpcMainEvent,
  state: WorkbenchState
) => {
  console.log('WorkbenchState Updated, ', Date.now());
  const workingDirectory = '/home/matt/projects/cdk-sandbox/testing-workbench/';
  await fs.writeFile(
    path.join(workingDirectory, '.workbench', 'workbench.json'),
    JSON.stringify(state),
    { encoding: 'utf-8' }
  );

  child_process.exec(
    'npx projen',
    {
      cwd: workingDirectory,
    },
    (error, stdout, stderr) => {
      if (error) {
        throw new Error(error);
      }
    }
  );
};

export default workbenchStateUpdateListener;
