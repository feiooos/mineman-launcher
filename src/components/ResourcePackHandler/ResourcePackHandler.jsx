import { useEffect, useState } from 'react';
import styles from './ResourcePackHandler.module.css';
import DownloadResourcePackHandler from '../DownloadResourcePackHandler';

const ResourcePackHandler = () => {
  const [localVersion, setLocalVersion] = useState()
  const [remoteVersion, setRemoteVersion] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState()
  const [noRPInstalled, setNoRPInstalled] = useState()
  const [upToDate, setUpToDate] = useState()
  const [updating, setUpdating] = useState()
  const [progress, setProgress] = useState('')

  const getRPVersions = async () => {
    const { getRPLocalVersion,getRPRemoteVersion} = window.mineman
    Promise.all([getRPLocalVersion(), getRPRemoteVersion()])
    .then(([lv, rv]) => {
      setLocalVersion(lv || 'Unset')
      setRemoteVersion(rv)
    })
    .catch(setError)
  }

  const onEndCB = () => {
    setUpdating(false)
    getRPVersions();
  }

  const onClickDownload = () => {
    setLocalVersion(null);
    setError(null)
    setUpdating(true)
  }

  useEffect(() => {
    getRPVersions()
  }, [])

  useEffect(() => {
    setLoading(!localVersion && !remoteVersion)
    setNoRPInstalled(!localVersion)
    setUpToDate(!error && localVersion === remoteVersion)
  }, [localVersion, remoteVersion, error])

  const label = () => {
    if(error) return <p className={styles.label}>{error}</p>
    if(updating) return <p className={styles.label}>Downloading... {progress ? `${progress}%` : null}</p>
    if(loading) return <p className={styles.label}>Loading</p>
    if(noRPInstalled) return <p className={styles.label}>You don't have cbas+ resource pack installed!</p>
    if(upToDate) return <p className={styles.label}>The cbas+ resource pack is up to date</p>
    return <p className={styles.label}>There is a newer version of the cbas+ resource pack</p>
  }

  return (
    <div className={styles.resourcePack}>
      <div className={styles.labelContainer}>
        {label()}
      </div>
      <DownloadResourcePackHandler
        onClickCB={onClickDownload}
        setProgress={setProgress}
        onEndCB={onEndCB}
        upToDate={!loading && upToDate}
      />
    </div>
  );
}

export default ResourcePackHandler;
