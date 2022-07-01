import { BrowserWindow } from 'electron';
import { openWorkbenchHandler } from '../listeners/open-workbench-listener';
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;
import { createWindow } from '../main';

export function buildFileMenu(): MenuItemConstructorOptions {
  return {
    label: '&File',
    submenu: [
      {
        label: '📂 &Open...',
        accelerator: 'CommandOrControl+O',
        click: async () => {
          const focusedWindow = BrowserWindow.getFocusedWindow();
          if (!focusedWindow) {
            await createWindow();
          }
          const { webContents } = BrowserWindow.getFocusedWindow()!;

          await openWorkbenchHandler((bus, args) =>
            webContents.send(bus, args)
          );
        },
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
        label: 'Export...',
        click: () => {
          BrowserWindow.getFocusedWindow()!.webContents.send('get-export');
        },
      },
      {
        label: '&Close',
        accelerator: 'CommandOrControl+W',
        click: () => {
          BrowserWindow.getFocusedWindow()!.webContents.send('reset-state', {});
        },
      },
    ],
  };
}
