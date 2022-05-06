import { nanoid } from 'nanoid';
import produce from 'immer';
import { PickerWidgetState, Set, WorkbenchState } from '../states';

export interface PickerState {
  pickers: Record<string, PickerWidgetState>;

  addPicker(picker: {
    fqn: string;
    onPicked: (props: any) => void;
    x: number;
    y: number;
  }): void;

  removePicker(picker: string): void;
}

export const pickerState = (set: Set): PickerState => ({
  pickers: {},
  // @ts-ignore
  addPicker: ({ fqn, x, y, onPicked }) => {
    set((state: WorkbenchState) => ({
      pickers: {
        ...state.pickers,
        [nanoid()]: {
          x,
          y,
          picker: fqn,
          onPicked,
        },
      },
    }));
  },
  removePicker: (pickerKey: string) =>
    set(
      produce((state) => {
        delete state.pickers[pickerKey];
      })
    ),
});

export default pickerState;
