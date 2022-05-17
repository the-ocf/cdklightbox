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
  flattenedChildren: Child[];
}

export type Children = Record<string, Child>;

export interface Tree {
  id: string;
  path: string;
  children: Children;
  constructInfo: ConstructInfo;
}

export function flattenChildren(children: Children): Child[] {
  const allChildren: Child[] = [];
  const getChildren = (childrens: Children) => {
    if (!childrens) {
      return;
    }
    Object.values(childrens)
      .filter((x: Child) => x.id !== 'Tree')
      .forEach((child: Child) => {
        allChildren.push(child);
        if (child.children) {
          getChildren(child.children);
        }
      });
  };
  getChildren(children);
  return allChildren;
}

export const cdkAppState = (set: Set): CdkAppState => ({
  cdkApp: undefined,
  setCdkApp(state: WorkbenchState) {
    set(() => {
      const flattenedChildren = flattenChildren(state.cdkApp!.tree.children);
      return { ...state, cdkApp: { ...state.cdkApp, flattenedChildren } };
    });
  },
});
