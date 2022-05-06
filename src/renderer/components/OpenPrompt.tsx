import { ipcRenderer } from 'electron';
import styles from './styles/commands.module.css';

export function OpenPrompt() {
  const openWorkbenchClickHandler = async () => {
    ipcRenderer.send('open-workbench');
  };
  return (
    <div className="flex flex-col flex-auto justify-center overflow-hidden">
      <button
        type="button"
        className={styles.commands}
        onClick={openWorkbenchClickHandler}
      >
        Open CDK App...
      </button>
    </div>
  );
}

export default OpenPrompt;
