import produce from 'immer';
import { Set, WorkbenchState } from '../states';

export interface LevelFilterState {
  levelFilter: number;

  setLevelFilter(level: number): void;
}

export const levelFilterState = (set: Set): LevelFilterState => {
  return {
    levelFilter: 3,
    setLevelFilter(level: number): void {
      set(
        produce(function (state: WorkbenchState) {
          state.levelFilter = level;
        })
      );
    },
  };
};
