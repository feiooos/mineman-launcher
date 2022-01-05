import { useState } from 'react'
import styles from './PlayButton.module.css'
const PlayButton = () => {
  const [launcher, setLauncher] = useState()

  const onClickLaunchMinecraft = async () => {
    const { launchMinecraft } = window.mineman
    const launcherType = await launchMinecraft();
    setLauncher(launcherType)

    setTimeout(() => {
      setLauncher(null)
    }, 2000)
  }

  let label = 'Launch Minecraft'
  if(launcher === 0) label = 'No Minecraft detected...'
  if(launcher === 1) label = 'Launching with Microsoft Store launcher...'
  if(launcher === 2) label = 'Launching with Microsoft launcher...'
  return (
  <div className={styles.container}>
    <button className={styles.button} onClick={onClickLaunchMinecraft}>{label}</button>
  </div>
)}

export default PlayButton;
