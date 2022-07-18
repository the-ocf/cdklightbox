import { dialog } from 'electron';
import { writeFileSync } from 'fs';
import path from 'path';
import IpcMainEvent = Electron.IpcMainEvent;

async function writeFile(filePath: string, dataUrl: any) {
  const [, encodedString] = dataUrl.split(',');
  writeFileSync(filePath, Buffer.from(encodedString, 'base64'));
}

export const saveExportListener = async (
  _event: IpcMainEvent,
  args: { dataUrl: any; workingDirectory: string }
) => {
  console.log('save export listener args: ', args);
  const dialogResults = await dialog.showSaveDialog({
    properties: [],
    defaultPath: path.join(args.workingDirectory, 'diagram.png'),
    message: 'Save Diagram',
    filters: [{ name: 'PNG Image', extensions: ['*.png'] }],
  });
  if (dialogResults.canceled) {
    return;
  }
  const filePath = dialogResults.filePath!;
  await writeFile(filePath, args.dataUrl);
};
