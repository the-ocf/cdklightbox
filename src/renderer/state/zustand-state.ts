import create from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { undoMiddleware } from 'zundo';
import { Set, WorkbenchState } from './states';
import { errorState } from './substates/error-state';
import { workingDirectoryState } from './substates/working-directory-state';

import { statusState } from './substates/status-state';
import { cdkAppState } from './substates/cdk-app-state';
import { levelFilterState } from './substates/level-filter-state';
import { widgetsViewState } from './substates/widget-view-state';
import { workbenchViewState } from './substates/workbench-view-state';
import { showHiddenState } from './substates/show-hidden-state';

// eslint-disable-next-line import/prefer-default-export
export const useWorkbenchStore = create<WorkbenchState>(
  // @ts-ignore
  subscribeWithSelector(
    persist(
      undoMiddleware(
        // @ts-ignore
        (set: Set, get: () => WorkbenchState) => ({
          ...errorState(set),
          ...statusState(set),
          ...workingDirectoryState(set),
          ...cdkAppState(set),
          ...levelFilterState(set),
          ...widgetsViewState(set, get),
          ...workbenchViewState(set),
          ...showHiddenState(set),
          resetState() {
            // @ts-ignore
            set(() => ({
              workingDirectory: '',
              widgets: {},
              cdkApp: {},
              scale: 1,
              levelFilter: 3,
              showHidden: false,
              workbenchPosition: { x: 0, y: 0 },
            }));
          },
        }),
        { exclude: ['workbenchPosition', 'scale'], coolOffDurationMs: 1000 }
      ),
      {
        name: 'workbenchState',
        getStorage: () => localStorage,
      }
    )
  )
);
