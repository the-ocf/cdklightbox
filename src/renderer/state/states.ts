import { ErrorsState } from './substates/error-state';
import { WorkingDirectoryState } from './substates/working-directory-state';
import { StatusState } from './substates/status-state';
import { CdkAppState } from './substates/cdk-app-state';

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
    StatusState {}
