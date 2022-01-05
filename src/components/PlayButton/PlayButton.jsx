import { useState } from 'react'
import styles from './PlayButton.module.css'
const PlayButton = () => {
  const [launcher, setLauncher] = useState()
  const [disabled, setDisabled] = useState()

  const onClickLaunchMinecraft = async () => {
    setDisabled(true)
    const { launchMinecraft } = window.mineman
    console.log('click')
    const launcherType = await launchMinecraft();
    console.log(launcherType)
    setLauncher(launcherType)

    setTimeout(() => {
      setLauncher(null)
      setDisabled(false)
    }, 2000)
  }

  let label = 'Launch Minecraft'
  if(launcher === 0) label = 'No Minecraft detected...'
  if(launcher === 1) label = 'Launching with Microsoft Store launcher...'
  if(launcher === 2) label = 'Launching with Microsoft launcher...'
  return (
  <div className={styles.container}>
    <button disabled={disabled} className={`${styles.button} ${disabled ? '' : styles.buttonHover}`} onClick={onClickLaunchMinecraft}>{label}</button>
  </div>
)}

export default PlayButton;
