import { useWorkbenchStore } from '../zustand-state';

describe('errors', () => {
  it('adds it', () => {
    useWorkbenchStore.setState(() => ({
      widgets: {},
      pickers: {},
      docs: {},
      errors: {},
    }));

    // when
    useWorkbenchStore.getState().addErrors({ message: 'some error' });

    const updatedState = useWorkbenchStore.getState();
    const entries = Object.entries(updatedState.errors);
    expect(entries).toHaveLength(1);
    const doc = entries[0][1];
    expect(doc.message).toEqual('some error');
  });

  it('removes it', () => {
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
  });
});
