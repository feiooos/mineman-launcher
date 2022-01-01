import { useState } from 'react';
import styles from './DownloadResourcePackHandler.module.css';

const DownloadResourcePackHandler = ({onClickCB, onEndCB, progress, setProgress}) => {
  const [downloading, setDownloading] = useState(false)
  // const [progress, setProgress] = useState('')

  const endCB = () => {
    setDownloading(false)
    onEndCB();
  }

  const onClick = async () => {
    onClickCB();
    setDownloading(true)
    window.mineman.downloadRP(null, setProgress, endCB);
  }

  return (
    <div className={styles.container}>
      <button disabled={downloading} type="button" onClick={onClick} className={`material-icons-round ${styles.button} ${!downloading ? styles.buttonHover : ''}`}>file_download</button>
    </div>
  );
}

export default DownloadResourcePackHandler;
