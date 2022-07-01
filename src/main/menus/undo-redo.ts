import { BrowserWindow } from 'electron';

export const buildUndoRedoMenu = () => ({
  label: 'Edit',
  submenu: [
    {
      label: 'Undo',
      accelerator: 'CommandOrControl+Z',
      selector: 'undo:',
      click() {
        BrowserWindow.getFocusedWindow()!.webContents.send('undo');
      },
    },
    {
      label: 'Redo',
      accelerator: 'Shift+CommandOrControl+Z',
      selector: 'redo:',
      click() {
        BrowserWindow.getFocusedWindow()!.webContents.send('redo');
      },
    },
  ],
});
