import { dialog } from 'electron';
import { checkIfEmpty } from './fs-utils';
import { openWorkbench } from '../providers/open-workbench';
import IpcMainEvent = Electron.IpcMainEvent;

export const openWorkbenchListener = async (event: IpcMainEvent) => {
  // @ts-ignore
  const dialogResults = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (dialogResults.canceled) {
    return;
  }
  const filePath = dialogResults.filePaths[0];
  const isEmpty = checkIfEmpty(filePath);
  if (isEmpty) {
    event.reply('error', {
      message: 'Directory is empty, cannot open an empty directory.',
    });
    return;
  }
  event.reply('status', {
    message: `Opening app at ${filePath}`,
  });
  const state = await openWorkbench(filePath);
  event.reply('load-workbench-state', {
    workingDirectory: filePath,
    ...state,
  });
};
