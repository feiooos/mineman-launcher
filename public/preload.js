const { contextBridge } = require('electron')
const os = require('os')
const fs = require('fs')

const getResourcePackLocalVersion = () => {
  if(os.platform() !== 'win32') return false

  const minecraftFolder = fs.readFile(`${os.homedir()}/AppData/Roaming/.minecraft`)
  console.log(minecraftFolder)
}

contextBridge.exposeInMainWorld('mineman', {
  homeDir: os.homedir(),
  resourcePackLocalVersion: getResourcePackLocalVersion()
})
