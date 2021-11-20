import styles from './RemoteVersionLabel.module.css'
import IconNewRelease from '../IconNewRelease/IconNewRelease'

const LocalVersionLabel = ({version}) => {
  if (!version) return (<p>Loading...</p>)

  return (
    <div className={styles.container}>
      <p>Remote version: <span className={styles.label}>{version}</span></p>
      <IconNewRelease />
    </div>
  )
}

export default LocalVersionLabel;
