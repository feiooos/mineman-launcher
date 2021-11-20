import styles from './LocalVersionLabel.module.css'
import IconWarning from '../IconWarning'
import DownloadResourcePackHandler from '../DownloadResourcePackHandler'

const LocalVersionLabel = ({version}) => {
  if (!version) return (<p>Loading...</p>)

  return (
    <div className={styles.container}>
      <div className={styles.labelContainer}>
        <p>Local version: <span className={styles.label}>{version}</span></p>
        <IconWarning />
      </div>
      <DownloadResourcePackHandler />
    </div>
  )
}

export default LocalVersionLabel;
