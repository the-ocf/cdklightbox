import { Set } from '../states';

export interface WorkingDirectoryState {
  setWorkingDirectory(workingDirectory: string): void;
  workingDirectory: string;
}
export const workingDirectoryState = (set: Set) => ({
  workingDirectory: '',
  setWorkingDirectory(workingDirectory: string) {
    set(() => ({
      workingDirectory,
    }));
  },
});

export default workingDirectoryState;
