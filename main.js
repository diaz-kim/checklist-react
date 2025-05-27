import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '../public/notepad_icon.ico'),
    webPreferences: {
      nodeIntegration: false,
    }
  });

  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});