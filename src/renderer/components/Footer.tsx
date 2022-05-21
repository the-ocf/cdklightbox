import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { useWorkbenchStore } from '../state';
import footer from './styles/footer.module.css';
import { StatusMessage } from '../state/substates/status-state';
import IpcRendererEvent = Electron.IpcRendererEvent;

export function Errors() {
  const addErrors = useWorkbenchStore((state) => state.addErrors);
  const addStatus = useWorkbenchStore((state) => state.addStatus);
  const clearError = useWorkbenchStore((state) => state.clearError);
  const errors = useWorkbenchStore((state) => Object.entries(state.errors));

  // @ts-ignore
  const errorListener = (event: IpcRendererEvent, newError: ErrorMessage) => {
    addErrors(newError);
  };

  const statusListener = (
    _event: IpcRendererEvent,
    newStatus: StatusMessage
  ) => {
    addStatus(newStatus);
  };

  // @ts-ignore
  useEffect(() => {
    const errorHandler = ipcRenderer.on('error', errorListener);
    return () => errorHandler.removeListener('error', errorListener);
  }, [errorListener]);

  // @ts-ignore
  useEffect(() => {
    const errorHandler = ipcRenderer.on('status', statusListener);
    return () => errorHandler.removeListener('status', statusListener);
  }, [statusListener]);

  return (
    <div className={`justify-end ${footer.container}`}>
      {errors.map(([key, error]) => (
        <button type="button" key={key} onClick={() => clearError(key)}>
          {error.message}
        </button>
      ))}
    </div>
  );
}

export function Footer() {
  return <Errors />;
}
