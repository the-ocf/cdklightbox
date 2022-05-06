import { nanoid } from 'nanoid';
import produce from 'immer';
import { Set, WorkbenchState } from '../states';

export interface StatusMessage {
  message: string;
}

export interface StatusState {
  statuses: Record<string, StatusMessage>;

  addStatus(newMessage: StatusMessage): void;
}

export const statusState = (set: Set): StatusState => ({
  statuses: {},
  addStatus(newMessage: StatusMessage) {
    set(
      produce((state: WorkbenchState) => {
        state.statuses[nanoid()] = newMessage;
      })
    );
  },
});
