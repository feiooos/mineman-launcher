import { useEffect, useState } from 'react';
import styles from './ResourcePackHandler.module.css';

const getHomeDir = () => {
  const {homeDir} = window.mineman
  return homeDir;
}

const ResourcePackHandler = () => {
  // const [localVersion, setLocalVersion] = useState()

  useEffect(() => {
    console.log('ResourcePackHandler', getHomeDir())
  }, [])

  return (
    <div className={styles.resourcePack}>
      <p>Resource pack status</p>
    </div>
  );
}

export default ResourcePackHandler;
