import ResourcePackHandler from '../ResourcePackHandler';
import styles from './App.module.css'
import PlayButton from '../PlayButton'

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.blurryBg} />
      <main>
        <header className={styles.appHeader}>
          <h1>MINEMAN LAUNCHER</h1>
        </header>
          <ResourcePackHandler />
          <PlayButton />
      </main>
    </div>
  );
}

export default App;
