import produce from 'immer';
import { Set, WorkbenchState } from '../states';

export interface RoseState {
  roseIsDisabled: boolean;

  disableRose(): void;

  enableRose(): void;
}

export const roseState = (set: Set): RoseState => ({
  roseIsDisabled: false,
  enableRose(): void {
    set(
      produce((state: WorkbenchState) => {
        state.roseIsDisabled = false;
      })
    );
  },
  disableRose(): void {
    set(
      produce((state: WorkbenchState) => {
        state.roseIsDisabled = true;
      })
    );
  },
});
