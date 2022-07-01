import { app, dialog } from 'electron';
import { checkIfEmpty } from './fs-utils';
import { openWorkbench } from '../providers/open-workbench';
import IpcMainEvent = Electron.IpcMainEvent;

export async function openWorkbenchHandler(
  send: (bus: string, args: any) => void
) {
  console.log('opening dialog...');
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
    send('error', {
      message: 'Directory is empty, cannot open an empty directory.',
    });
    return;
  }
  send('status', {
    message: `Opening app at ${filePath}`,
  });
  const state = await openWorkbench(filePath);
  app.addRecentDocument(filePath);
  send('load-workbench-state', {
    workingDirectory: filePath,
    ...state,
  });
}

export const openWorkbenchListener = async (event: IpcMainEvent) => {
  const send = event.reply;
  // @ts-ignore
  await openWorkbenchHandler(send);
};
