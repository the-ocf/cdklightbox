import fs from 'fs/promises';
import path from 'path';
import { WorkbenchState } from '../../renderer/state';
import IpcMainEvent = Electron.IpcMainEvent;

export const LIGHTBOX_STATE_DIRECTORY = '.lightbox';
export const LIGHTBOX_STATE_FILE = 'state.json';

export const workbenchStateUpdateListener = async (
  _event: IpcMainEvent,
  state: WorkbenchState
) => {
  console.log('WorkbenchState Updated, ', Date.now());

  const { workingDirectory } = state;
  const lightboxStateDirectory = path.join(
    workingDirectory,
    LIGHTBOX_STATE_DIRECTORY
  );
  await fs.mkdir(lightboxStateDirectory, { recursive: true });
  await fs.writeFile(
    path.join(lightboxStateDirectory, LIGHTBOX_STATE_FILE),
    JSON.stringify(state, null, 2),
    { encoding: 'utf-8' }
  );
};

export default workbenchStateUpdateListener;
