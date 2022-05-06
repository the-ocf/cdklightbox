import produce from 'immer';
import { DocState, Set } from '../states';

export interface DocsState {
  docs: Record<string, DocState>;
  addDocs(docKey: string, docState: DocState): void;

  removeDocs(docKey: string): void;
}

export const docsState = (set: Set): DocsState => ({
  docs: {},

  addDocs(docKey: string, docState: DocState): void {
    set(
      produce((state) => {
        state.docs[docKey] = docState;
      })
    );
  },
  removeDocs(docKey: string): void {
    set(
      produce((state) => {
        delete state.docs[docKey];
      })
    );
  },
});
