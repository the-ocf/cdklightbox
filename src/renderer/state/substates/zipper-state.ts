import produce from 'immer';
import { Parameter, Set, WorkbenchState } from '../states';
import { unzipIt, zipIt } from '../zip-utils';

export interface ZipperState {
  unzip(parameterProvider: (state: WorkbenchState) => Parameter): void;

  zip(parameterProvider: (state: WorkbenchState) => Parameter): void;
}

export const zipperState = (set: Set): ZipperState => ({
  unzip(parameterProvider: (state: WorkbenchState) => Parameter): void {
    set(
      produce((state) => {
        unzipIt(state, parameterProvider);
      })
    );
  },
  zip(parameterProvider: (state: WorkbenchState) => Parameter): void {
    set(
      produce((state) => {
        zipIt(state, parameterProvider, { level: 1 });
      })
    );
  },
});
