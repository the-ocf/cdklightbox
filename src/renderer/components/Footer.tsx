import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { useWorkbenchStore } from '../state';
import footer from './styles/footer.module.css';
import { StatusMessage } from '../state/substates/status-state';
import { ErrorMessage } from '../state/substates/error-state';
import IpcRendererEvent = Electron.IpcRendererEvent;

export function Errors() {
  const addErrors = useWorkbenchStore((state) => state.addErrors);
  const addStatus = useWorkbenchStore((state) => state.addStatus);
  const clearError = useWorkbenchStore((state) => state.clearError);
  const errors = useWorkbenchStore((state) => Object.entries(state.errors));

  // @ts-ignore
  useEffect(() => {
    const errorListener = (
      _event: IpcRendererEvent,
      newError: ErrorMessage
    ) => {
      addErrors(newError);
    };

    const errorHandler = ipcRenderer.on('error', errorListener);
    return () => errorHandler.removeListener('error', errorListener);
  }, [addErrors]);

  // @ts-ignore
  useEffect(() => {
    const statusListener = (
      _event: IpcRendererEvent,
      newStatus: StatusMessage
    ) => {
      addStatus(newStatus);
    };

    const errorHandler = ipcRenderer.on('status', statusListener);
    return () => errorHandler.removeListener('status', statusListener);
  }, [addStatus]);

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
