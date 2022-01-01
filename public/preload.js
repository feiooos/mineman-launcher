const { contextBridge } = require('electron')
const os = require('os')
const fs = require('fs')
const path = require('path')
const https = require('https')
const JSZip = require('jszip')

const rpDirPath = path.join(os.homedir(), 'AppData', 'Roaming', '.minecraft', 'resourcepacks')
const getRPLocalVersion = () => {
  return new Promise((resolve, reject) => {
    if(os.platform() !== 'win32') return reject(null)

    const rsPath = path.join(rpDirPath, 'cbas+.zip')
    return fs.readFile(rsPath, (rpError, rpData) => {
      if(rpError?.code === "ENOENT") return reject('No resource pack found')

      return JSZip.loadAsync(rpData)
        .then((zip) => {
          const files = Object.keys(zip.files);
          const versionFile = files.filter((f) => f.includes('version.txt'))[0]
          if (!versionFile) return reject('No version file found. Update your resource pack.')

          const versionFilePath = path.join(rpDirPath, versionFile)
          fs.readFile(versionFilePath, 'utf-8', (versionError, versionData) => {
            if(versionError?.code === "ENOENT") return reject("Couldn't open version file")

            resolve(versionData)
          })
        });
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
  console.log(rpURL)
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

      const file = fs.createWriteStream(path.join(rpDirPath, 'cbas+.zip'));
      const length = parseInt(res.headers['content-length'], 10)
      let downloaded = 0
      res.on('data', (chunk) => {
        file.write(chunk);
        downloaded += chunk.length;
        setProgress(Math.round(100.0 * downloaded / length).toString())
      })
      .on('end', () => {
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

contextBridge.exposeInMainWorld('mineman', {
  homeDir: os.homedir(),
  getRPLocalVersion,
  getRPRemoteVersion,
  downloadRP
})
