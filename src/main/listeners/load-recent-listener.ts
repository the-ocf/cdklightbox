import { app, BrowserWindow } from 'electron';
import { checkIfEmpty } from './fs-utils';
import { openWorkbench } from '../providers/open-workbench';
import IpcMainEvent = Electron.IpcMainEvent;

export const loadRecentListener = async (
  _event: IpcMainEvent,
  filePath: string
) => {
  const isEmpty = checkIfEmpty(filePath);
  const { webContents } = BrowserWindow.getFocusedWindow()!;
  if (isEmpty) {
    webContents.send('error', {
      message: 'Directory is empty, cannot open an empty directory.',
    });
    return;
  }
  webContents.send('status', {
    message: `Opening app at ${filePath}`,
  });
  const state = await openWorkbench(filePath);
  app.addRecentDocument(filePath);
  webContents.send('load-workbench-state', {
    workingDirectory: filePath,
    ...state,
  });
};
