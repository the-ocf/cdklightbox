import { useWorkbenchStore } from '../zustand-state';

describe('setWorkingDirectory', () => {
  it('Sets properly', () => {
    useWorkbenchStore.setState(() => ({
      workingDirectory: undefined,
      widgets: {},
      pickers: {},
      docs: {},
    }));

    // when

    const workingDirectory = 'asdfasfd';
    useWorkbenchStore.getState().setWorkingDirectory(workingDirectory);

    const updatedState = useWorkbenchStore.getState();

    expect(updatedState.workingDirectory).toEqual(workingDirectory);
  });
});
