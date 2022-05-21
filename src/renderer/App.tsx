import './App.css';
import 'tailwindcss/tailwind.css';
import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { WorkbenchSurface } from './components/WorkbenchSurface';
import { useWorkbenchStore, WorkbenchState } from './state';
import { OpenPrompt } from './components/OpenPrompt';
import { Footer } from './components/Footer';
import IpcRendererEvent = Electron.IpcRendererEvent;

function App() {
  const workingDirectory = useWorkbenchStore((state) => state.workingDirectory);
  const resetState = useWorkbenchStore((state) => state.resetState);
  const setWorkingDirectory = useWorkbenchStore(
    (state) => state.setWorkingDirectory
  );
  const workbenchState = useWorkbenchStore((state) => state);
  const loadState = useWorkbenchStore((state) => state.setCdkApp);
  const undo = useWorkbenchStore((state) => state.undo);
  const redo = useWorkbenchStore((state) => state.redo);

  useEffect(() => {
    return useWorkbenchStore.subscribe(
      (state) => state,
      // @ts-ignore
      (state) => {
        const {
          levelFilter,
          scale,
          showHidden,
          widgets,
          workbenchPosition,
          // eslint-disable-next-line @typescript-eslint/no-shadow
          workingDirectory,
        } = state;

        if (!workingDirectory) {
          // don't do anything if we don't have a workingDirectory
          return;
        }

        ipcRenderer.send('workbench-state-update', {
          levelFilter,
          scale,
          showHidden,
          widgets,
          workbenchPosition,
          workingDirectory,
        });
      }
    );
  });
  // @ts-ignore
  useEffect(() => {
    const listener = () => {
      if (redo) redo();
    };

    const handler = ipcRenderer.on('redo', listener);
    return () => handler.removeListener('redo', listener);
  }, [redo, workbenchState]);

  // @ts-ignore
  useEffect(() => {
    const listener = () => {
      console.debug('Closing project');
      resetState();
    };

    const handler = ipcRenderer.on('reset-state', listener);
    return () => handler.removeListener('reset-state', listener);
  }, [resetState]);

  // @ts-ignore
  useEffect(() => {
    const listener = () => {
      if (undo) undo();
    };

    const handler = ipcRenderer.on('undo', listener);
    return () => handler.removeListener('undo', listener);
  }, [undo, workbenchState]);

  // @ts-ignore
  useEffect(() => {
    const listener = (
      _event: IpcRendererEvent,
      loadedState: WorkbenchState
    ) => {
      console.log('loaded state: ', loadedState);
      loadState(loadedState);
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
