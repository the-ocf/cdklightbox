import create from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { Set, WorkbenchState } from './states';
import { errorState } from './substates/error-state';
import { workingDirectoryState } from './substates/working-directory-state';

import { statusState } from './substates/status-state';
import { cdkAppState } from './substates/cdk-app-state';
import { levelFilterState } from './substates/level-filter-state';

// eslint-disable-next-line import/prefer-default-export
export const useWorkbenchStore = create<WorkbenchState>(
  // @ts-ignore
  subscribeWithSelector(
    persist(
      (set: Set) => ({
        ...errorState(set),
        ...statusState(set),
        ...workingDirectoryState(set),
        ...cdkAppState(set),
        ...levelFilterState(set),
      }),

      {
        name: 'localStorage',
        getStorage: () => localStorage,
      }
    )
  )
);