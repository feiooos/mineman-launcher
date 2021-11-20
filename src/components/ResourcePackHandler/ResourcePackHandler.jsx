import { useEffect, useState } from 'react';
import styles from './ResourcePackHandler.module.css';

const ResourcePackHandler = () => {
  const [localVersion, setLocalVersion] = useState()
  const [remoteVersion, setRemoteVersion] = useState()
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState('')

  useEffect(() => {
    const getRPVersions = async () => {
      const { getRPLocalVersion,getRPRemoteVersion} = window.mineman
      Promise.all([getRPLocalVersion(), getRPRemoteVersion()])
      .then(([lv, rv]) => {
        setLocalVersion(lv || 'Unset')
        setRemoteVersion(rv)
      })
    }
    getRPVersions()
  }, [])

  const onClick = async () => {
    setDownloading(true)
    const rp = await window.mineman.downloadRP(null, setProgress);
    if(rp) setDownloading(false)
    console.log(rp)
  }

  return (
    <div className={styles.resourcePack}>
      <p>Resource pack status</p>
      <p>Local version: {localVersion || 'Loading'}</p>
      <p>Remote version: {remoteVersion || 'Loading'}</p>
      {(!downloading && (
        <button type="button" onClick={onClick}>Download latest Resource Pack version</button>
      )) || (
        <p>Downloading... {progress ? `${progress}% done.` : null}</p>
      )}
    </div>
  );
}

export default ResourcePackHandler;
