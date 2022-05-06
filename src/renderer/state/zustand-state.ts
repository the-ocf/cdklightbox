import create from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { Set, WorkbenchState } from './states';
import { errorState } from './substates/error-state';
import { workingDirectoryState } from './substates/working-directory-state';
import { widgetsState } from './substates/widget-state';
import { statusState } from './substates/status-state';

// eslint-disable-next-line import/prefer-default-export
export const useWorkbenchStore = create<WorkbenchState>(
  // @ts-ignore
  subscribeWithSelector(
    persist(
      (set: Set) => ({
        ...errorState(set),
        ...statusState(set),
        ...workingDirectoryState(set),
        ...widgetsState(set),
        loadState(newState: Partial<WorkbenchState>) {
          set(() => newState);
        },
      }),

      {
        name: 'localStorage',
        getStorage: () => localStorage,
      }
    )
  )
);
