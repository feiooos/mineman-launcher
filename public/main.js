const { app, BrowserWindow, protocol, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

const startUrl = process.env.BROWSER_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
});
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    show: false,
    width:800,
    height:640,
    maxHeight:640,
    maxWidth:800,
    minHeight:640,
    minWidth:800,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    },
  })

  mainWindow.removeMenu()
  mainWindow.loadURL(startUrl)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
  setupLocalFilesNormalizerProxy();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('quit-app', () => {
  app.quit();
});
