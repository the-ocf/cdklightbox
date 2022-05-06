import { useWorkbenchStore } from '../zustand-state';

describe('pickers', () => {
  it('adds it', () => {
    useWorkbenchStore.setState(() => ({
      widgets: {},
      pickers: {},
    }));

    // when
    const onPicked = () => ({});
    useWorkbenchStore
      .getState()
      .addPicker({ fqn: 'whatever', x: 100, y: 200, onPicked });

    const updatedState = useWorkbenchStore.getState();
    const entries = Object.entries(updatedState.pickers);
    expect(entries).toHaveLength(1);
    const picker = entries[0][1];
    expect(picker.x).toEqual(100);
    expect(picker.y).toEqual(200);
    expect(picker.onPicked).toEqual(onPicked);
    expect(picker.picker).toEqual('whatever');
  });

  it('removes it', () => {
    // given
    const pickerKey = 'whatever';
    useWorkbenchStore.setState(() => ({
      widgets: {},
      pickers: {
        someotherpicker: {
          x: 0,
          y: 0,
          onPicked: () => ({}),
          picker: 'somefqn',
        },
        [pickerKey]: {
          x: 0,
          y: 0,
          onPicked: () => ({}),
          picker: 'somefqn',
        },
      },
    }));

    // when
    useWorkbenchStore.getState().removePicker(pickerKey);

    // then
    const updatedState = useWorkbenchStore.getState();
    const entries = Object.entries(updatedState.pickers);
    expect(entries).toHaveLength(1);
    expect(updatedState.pickers.someotherpicker).toBeDefined();
  });
});
