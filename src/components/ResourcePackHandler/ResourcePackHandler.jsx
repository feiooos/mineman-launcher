import { useEffect, useState } from 'react';
import styles from './ResourcePackHandler.module.css';
import LocalVersionLabel from '../LocalVersionLabel'
import RemoteVersionLabel from '../RemoteVersionLabel'

const ResourcePackHandler = () => {
  const [localVersion, setLocalVersion] = useState()
  const [remoteVersion, setRemoteVersion] = useState()

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

  return (
    <div className={styles.resourcePack}>
      <RemoteVersionLabel version={remoteVersion} />
      <LocalVersionLabel version={localVersion} />
    </div>
  );
}

export default ResourcePackHandler;
