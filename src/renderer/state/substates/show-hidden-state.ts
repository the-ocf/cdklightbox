import { Set, WorkbenchState } from '../states';

export interface ShowHiddenState {
  showHidden: boolean;
  setShowHidden: (value: boolean) => void;
}

export const showHiddenState = (set: Set): ShowHiddenState => {
  return {
    setShowHidden(value: boolean): void {
      set((state: WorkbenchState) => {
        state.showHidden = value;
      });
    },
    showHidden: false,
  };
};
