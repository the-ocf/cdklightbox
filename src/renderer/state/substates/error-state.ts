import { nanoid } from 'nanoid';
import produce from 'immer';
import { WorkbenchState, Set } from '../states';

export interface ErrorMessage {
  message: string;
}

export interface ErrorsState {
  errors: Record<string, ErrorMessage>;

  clearError(errorKey: string): void;

  addErrors(errorMessage: ErrorMessage): void;
}

export const errorState = (set: Set) => ({
  errors: {},
  addErrors(errorMessage: ErrorMessage) {
    set((state: WorkbenchState) => ({
      errors: { [nanoid()]: errorMessage, ...state.errors },
    }));
  },
  clearError(errorKey: string) {
    set(
      produce((state) => {
        delete state.errors[errorKey];
      })
    );
  },
});
