import { ErrorsState } from './substates/error-state';
import { WorkingDirectoryState } from './substates/working-directory-state';
import { StatusState } from './substates/status-state';
import { CdkAppState } from './substates/cdk-app-state';
import { LevelFilterState } from './substates/level-filter-state';
import { WidgetsViewState } from './substates/widget-view-state';
import { WorkbenchViewState } from './substates/workbench-view-state';

export interface WidgetState {
  id: string;
  x: number;
  y: number;
}

export type Set = (
  partial:
    | Partial<WorkbenchState>
    | ((state: WorkbenchState) => Partial<WorkbenchState> | WorkbenchState)
    | WorkbenchState,
  replace?: boolean | undefined
) => void;

export interface WorkbenchState
  extends ErrorsState,
    WorkingDirectoryState,
    CdkAppState,
    LevelFilterState,
    WidgetsViewState,
    WorkbenchViewState,
    StatusState {}
