import { useEffect, useState } from 'react';
import styles from './ResourcePackHandler.module.css';
import fs from 'fs'
import os from 'os'

const ResourcePackHandler = () => {
  const [localVersion, setLocalVersion] = useState('0')

  useEffect(() => {
    console.log('os', os.homedir())
    console.log('process.env', process.env.USERPROFILE)
    // fs.readFile(process.env.APPDATA)
  }, [])

  return (
    <div className={styles.resourcePack}>
      <p>Resource pack status</p>
    </div>
  );
}

export default ResourcePackHandler;
