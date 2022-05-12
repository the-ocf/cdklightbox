import { Set } from '../states';

export interface WorkbenchViewState {
  workbenchPosition: {
    x: number;
    y: number;
  };

  scale: number;
  setWorkbenchPosition(position: { x: number; y: number }): void;
  setScale(scale: number): void;
}

export const workbenchViewState = (set: Set): WorkbenchViewState => ({
  workbenchPosition: { x: 0, y: 0 },
  setWorkbenchPosition(position: { x: number; y: number }): void {
    set(() => ({
      workbenchPosition: position,
    }));
  },
  scale: 1,
  setScale(scale: number): void {
    set(() => ({
      scale,
    }));
  },
});
