import ResourcePackHandler from '../ResourcePackHandler';
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.blurryBg} />
      <main>
        <header className={styles.appHeader}>
          <h1>Mineman Launcher</h1>
        </header>
        <ResourcePackHandler />
      </main>
    </div>
  );
}

export default App;
