import { useState } from 'react';
import styles from './DownloadResourcePackHandler.module.css';

const DownloadResourcePackHandler = () => {
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState('')

  const onClick = async () => {
    setDownloading(true)
    const rp = await window.mineman.downloadRP(null, setProgress);
    if(rp) setDownloading(false)
    console.log(rp)
  }

  return (
    <div className={styles.container}>
      {(!downloading && (
        <button type="button" onClick={onClick} className={`material-icons-round ${styles.button}`}>sync</button>
      )) || (
        <p>Downloading... {progress ? `${progress}% done.` : null}</p>
      )}
    </div>
  );
}

export default DownloadResourcePackHandler;
