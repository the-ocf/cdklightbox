import { Set } from '../states';

export interface Child {
  id: string;
  children?: Record<string, Child>;
}

type ConstructInfo = any;

export interface CdkAppState {
  cdkApp?: CdkApp;

  setCdkApp(cdkApp: CdkApp): void;
}

export interface CdkApp {
  version: string;
  tree: Tree;
  flattenedChildren: Child[];
}

export interface Tree {
  id: string;
  path: string;
  children: Record<string, Child>;
  constructInfo: ConstructInfo;
}

function flattenChildren(children: Record<string, Child>): Child[] {
  const allChildren: Child[] = [];
  const getChildren = (children: Record<string, Child>) => {
    Object.values(children)
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
  setCdkApp(cdkApp: CdkApp) {
    set(() => {
      const flattenedChildren = flattenChildren(cdkApp.tree.children);
      return { cdkApp: { ...cdkApp, flattenedChildren } };
    });
  },
});
