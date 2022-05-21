import { Set, WorkbenchState } from '../states';

export interface Child {
  id: string;
  path: string;
  children?: Record<string, Child>;
}

type ConstructInfo = any;

export interface CdkAppState {
  cdkApp?: CdkApp;

  setCdkApp(state: WorkbenchState): void;
}

export interface CdkApp {
  version: string;
  tree: Tree;
}

export type Children = Record<string, Child>;

export interface Tree {
  id: string;
  path: string;
  children: Children;
  constructInfo: ConstructInfo;
}

export const cdkAppState = (set: Set): CdkAppState => ({
  cdkApp: undefined,
  setCdkApp(state: WorkbenchState) {
    set(() => {
      return { ...state };
    });
  },
});
