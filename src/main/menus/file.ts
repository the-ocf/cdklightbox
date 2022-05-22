import { BrowserWindow } from 'electron';
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;

export function buildFileMenu(): MenuItemConstructorOptions {
  return {
    label: '&File',
    submenu: [
      {
        label: '📂 &Open...',
        accelerator: 'Ctrl+O',
      },
      {
        label: 'Open Recent',
        role: 'recentDocuments',
        submenu: [
          {
            label: 'Clear Recent',
            role: 'clearRecentDocuments',
          },
        ],
      },
      {
        label: '&Close',
        accelerator: 'Ctrl+W',
        click: () => {
          BrowserWindow.getFocusedWindow()!.webContents.send('reset-state', {});
        },
      },
    ],
  };
}
