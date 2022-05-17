import fs from 'fs/promises';
import path from 'path';
import { WorkbenchState } from '../../renderer/state';
import IpcMainEvent = Electron.IpcMainEvent;

export const workbenchStateUpdateListener = async (
  _event: IpcMainEvent,
  state: WorkbenchState
) => {
  console.log('WorkbenchState Updated, ', Date.now());

  const { workingDirectory } = state;
  const lightboxStateDirectory = path.join(workingDirectory, '.lightbox');
  await fs.mkdir(lightboxStateDirectory, { recursive: true });
  await fs.writeFile(
    path.join(lightboxStateDirectory, 'state.json'),
    JSON.stringify(state, null, 2),
    { encoding: 'utf-8' }
  );
};

export default workbenchStateUpdateListener;
