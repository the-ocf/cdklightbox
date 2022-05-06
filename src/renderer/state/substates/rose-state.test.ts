import { useWorkbenchStore } from '../zustand-state';

describe('rose', () => {
  it('disables', () => {
    useWorkbenchStore.setState(() => ({
      roseIsDisabled: false,
    }));

    // when
    useWorkbenchStore.getState().disableRose();

    // then
    const updatedState = useWorkbenchStore.getState();
    expect(updatedState.roseIsDisabled).toEqual(true);
  });

  it('enables', () => {
    useWorkbenchStore.setState(() => ({
      roseIsDisabled: false,
    }));

    // when
    useWorkbenchStore.getState().enableRose();

    // then
    const updatedState = useWorkbenchStore.getState();
    expect(updatedState.roseIsDisabled).toEqual(false);
  });
});
