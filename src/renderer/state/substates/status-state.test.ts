import { useWorkbenchStore } from '../zustand-state';

describe('status', () => {
  it('adds it', () => {
    useWorkbenchStore.setState(() => ({
      widgets: {},
      pickers: {},
      docs: {},
      statuses: {
        existing: { message: 'for reasons' },
      },
    }));

    // when
    useWorkbenchStore.getState().addStatus({ message: 'some status' });

    const updatedState = useWorkbenchStore.getState();
    const entries = Object.entries(updatedState.statuses);
    expect(entries).toHaveLength(2);
    const doc = entries[1][1];
    expect(doc.message).toEqual('some status');
  });

  /* it('removes it', () => {
    // given
    useWorkbenchStore.setState(() => ({
      widgets: {},
      pickers: {},
      errors: {
        error_1: { message: 'some error 1' },
        error_2: { message: 'some error 2' },
      },
    }));

    // when
    useWorkbenchStore.getState().clearError('error_1');

    // then
    const updatedState = useWorkbenchStore.getState();
    const entries = Object.entries(updatedState.errors);
    expect(entries).toHaveLength(1);
    expect(entries[0][1].message).toEqual('some error 2');
  }); */
});
