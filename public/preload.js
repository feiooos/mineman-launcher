const { contextBridge } = require('electron')
const os = require('os')
const fs = require('fs')
const path = require('path')
const https = require('https')
const checksum = require('checksum')

const localRPVersionKey = 'mineman-rp-version'
const rpDirPath = path.join(os.homedir(), 'AppData', 'Roaming', '.minecraft', 'resourcepacks')
const getRPLocalVersion = () => {
  return new Promise((resolve, reject) => {
    if(os.platform() !== 'win32') return reject(null)

    const rsPath = path.join(rpDirPath, 'cbas+.zip')
    return fs.readFile(rsPath, (rpError, rpData) => {
      if(rpError?.code === "ENOENT") return reject('No resource pack found.')

      return checksum.file(rsPath, (err, sum) => {
        if (err) return reject(`Failed to check file hash due to ${err}`)

        const {hash, version} = JSON.parse(window.localStorage.getItem(localRPVersionKey)) || {}
        if(hash === sum) return resolve(version)

        reject('Version mismatch. Update your resource pack.')
      })
    })
  })
}

const getRPRemoteVersion = async () => {
  const releasesURL = 'https://api.github.com/repos/cbasreis/cbas-plus/releases'
  const releases = await fetch(releasesURL).then((data) => data.json())
  return releases[0].tag_name
}

const getRPDownloadURL = async () => {
  const releasesURL = 'https://api.github.com/repos/cbasreis/cbas-plus/releases'
  const releases = await fetch(releasesURL).then((data) => data.json())
  return releases[0].assets[0].browser_download_url
}

const downloadRP = async (dwURL, setProgress, endCB) => {
  const rpURL = dwURL || await getRPDownloadURL();
  return new Promise ((resolve, reject) => {
    fs.mkdir(rpDirPath, { recursive: true }, (err) => {
      if (err) throw err;
    });

    https.get(rpURL)
    .on('response', (res) => {
      if(res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadRP(res.headers.location, setProgress, endCB)
        return;
      }

      const filePath = path.join(rpDirPath, 'cbas+.zip')
      const file = fs.createWriteStream(filePath);
      const length = parseInt(res.headers['content-length'], 10)
      let downloaded = 0
      res.on('data', (chunk) => {
        file.write(chunk);
        downloaded += chunk.length;
        setProgress(Math.round(100.0 * downloaded / length).toString())
      })
      .on('end', async () => {
        const version = await getRPRemoteVersion()
        checksum.file(filePath, (err, sum) => {
          if (err) return reject(`Failed to check file hash due to ${err}`)

          window.localStorage.setItem(localRPVersionKey, JSON.stringify({version, hash: sum}))
        })
        resolve(true);
        endCB();
        file.end();
      })
    })
    .on("error", (err) => {
        console.log("Error: ", err.message);
        reject(err)
    });
  })
}

const launchMinecraft = async () => {
  const winStoreAppId = 'Microsoft.4297127D64EC6'
  const { exec } = require('child_process');
  const winStoreApp = await new Promise((resolve) => {
    exec(`powershell get-appxpackage *${winStoreAppId}*`, (_, stdout) => {
      if(!stdout) return resolve({isInstalled: false});

      const parsedOutput = stdout.split('\r\n')
      const packageFamilyName = parsedOutput.find((line) => {
        return line.includes('PackageFamilyName')
      }).split(' : ')[1]
      resolve({isInstalled: !!stdout, packageFamilyName})
    })
  })

  const microsoftLauncherPath = `C:\\Program Files (x86)\\Minecraft Launcher\\MinecraftLauncher.exe`
  const microsoftLauncher = await new Promise((resolve) => {
    return fs.access(microsoftLauncherPath, (error) => {
      if(error) resolve({isInstalled: false, error})

      resolve({isInstalled: true})
    })
  })

  if(winStoreApp.isInstalled) {
    exec(`explorer.exe shell:appsFolder\\${winStoreApp.packageFamilyName}!Minecraft`)
    return 1
  }
  if(microsoftLauncher.isInstalled) {
    exec(`cd "C:\\Program Files (x86)\\Minecraft Launcher" && MinecraftLauncher.exe`)
    return 2
  }

  return 0;
}

contextBridge.exposeInMainWorld('mineman', {
  homeDir: os.homedir(),
  getRPLocalVersion,
  getRPRemoteVersion,
  downloadRP,
  launchMinecraft
})
