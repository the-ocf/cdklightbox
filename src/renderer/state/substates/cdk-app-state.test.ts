import * as path from 'path';
import * as fs from 'fs';
import { useWorkbenchStore } from '../zustand-state';

describe('cdk-app-state', () => {
  it('children are flattened', () => {
    const tree = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'test_states', 'tree.json'), 'utf-8')
    );
    useWorkbenchStore.getState().setCdkApp(tree);

    expect(
      useWorkbenchStore.getState().cdkApp!.flattenedChildren
    ).toMatchSnapshot();
  });
});
