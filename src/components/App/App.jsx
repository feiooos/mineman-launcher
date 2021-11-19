import ResourcePackHandler from '../ResourcePackHandler';
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1>Mineman Launcher</h1>
      </header>
      <ResourcePackHandler />
    </div>
  );
}

export default App;
