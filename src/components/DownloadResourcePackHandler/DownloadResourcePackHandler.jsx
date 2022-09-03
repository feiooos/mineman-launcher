import { useState } from 'react';
import styles from './DownloadResourcePackHandler.module.css';

const DownloadResourcePackHandler = ({onClickCB, onEndCB, setProgress, upToDate}) => {
  const [downloading, setDownloading] = useState(false)

  const endCB = () => {
    setDownloading(false)
    onEndCB();
  }

  const onClick = async () => {
    onClickCB();
    setDownloading(true)
    window.mineman.downloadRP(null, setProgress, endCB);
  }

  let icon = 'file_download'
  if(downloading) icon = 'hourglass_bottom'
  if(upToDate) icon = 'verified'

  const containerStyles = (!downloading && !upToDate) ? styles.warningContainer : styles.container
  return (
    <div className={containerStyles}>
      <button disabled={downloading || upToDate} type="button" onClick={onClick} className={`material-icons-round ${styles.button} ${!downloading && !upToDate ? styles.buttonHover : ''}`}>{icon}</button>
    </div>
  );
}

export default DownloadResourcePackHandler;
