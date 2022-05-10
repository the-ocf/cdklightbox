import './App.css';
import 'tailwindcss/tailwind.css';
import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { WorkbenchSurface } from './components/WorkbenchSurface';
import { useWorkbenchStore, WorkbenchState } from './state';
import { OpenPrompt } from './components/OpenPrompt';
import { Footer } from './components/Footer';
import IpcRendererEvent = Electron.IpcRendererEvent;

function debounce(func: () => void, timeout = 300) {
  let timer: any;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function App() {
  const workingDirectory = useWorkbenchStore((state) => state.workingDirectory);
  const setWorkingDirectory = useWorkbenchStore(
    (state) => state.setWorkingDirectory
  );
  const loadState = useWorkbenchStore((state) => state.setCdkApp);

  /* useEffect(() => {
    const unsub = useWorkbenchStore.subscribe(
      (state) => state.widgets,
      // @ts-ignore
      (widgets) => {
        debounce(() => {
          ipcRenderer.send('workbench-state-update', {
            // this will need to include more than just the widgets, as there will eventually be other parameters
            // that will be important, like project settings and stuff.
            widgets,
          });
        }, 1000)();
      }
    );
    return unsub;
  }); */
  useEffect(() => {
    const listener = (
      _event: IpcRendererEvent,
      loadedState: WorkbenchState
    ) => {
      console.log('loaded state: ', loadedState);
      loadState(loadedState.cdkApp);
      setWorkingDirectory(loadedState.workingDirectory);
    };
    const handler = ipcRenderer.on('load-workbench-state', listener);
    return () => handler.removeListener('load-workbench-state', listener);
  });

  return (
    <div className="flex flex-col h-screen w-screen">
      {workingDirectory ? <WorkbenchSurface /> : null}
      {!workingDirectory ? <OpenPrompt /> : null}
      <Footer />
    </div>
  );
}

export default App;
