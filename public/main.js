const { app, BrowserWindow } = require('electron')
const path = require('path')

const frontendURL = 'http://localhost:3000'
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    show: false,
    width:800,
    height:640,
    maxHeight:640,
    maxWidth:800,
    minHeight:640,
    minWidth:800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    },
  })

  mainWindow.removeMenu()
  mainWindow.loadURL(frontendURL)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
