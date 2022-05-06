import { useWorkbenchStore } from '../zustand-state';

describe('docs', () => {
  it('adds it', () => {
    useWorkbenchStore.setState(() => ({
      widgets: {},
      pickers: {},
      docs: {},
    }));

    // when

    useWorkbenchStore.getState().addDocs('something', {
      default: '- no description',
      stability: 'stable',
      summary: 'A brief description of the authorization rule.',
      coords: { x: 0, y: 0 },
    });

    const updatedState = useWorkbenchStore.getState();
    const entries = Object.entries(updatedState.docs);
    expect(entries).toHaveLength(1);
    const doc = entries[0][1];
    expect(doc.default).toEqual('- no description');
    expect(doc.stability).toEqual('stable');
    expect(doc.summary).toEqual(
      'A brief description of the authorization rule.'
    );
  });

  it('removes it', () => {
    // given

    useWorkbenchStore.setState(() => ({
      widgets: {},
      pickers: {},
      docs: {
        something: {
          default: '- no description',
          stability: 'stable',
          summary: 'A brief description of the authorization rule.',
          coords: { x: 0, y: 0 },
        },
      },
    }));

    // when
    useWorkbenchStore.getState().removeDocs('something');

    // then
    const updatedState = useWorkbenchStore.getState();
    const entries = Object.entries(updatedState.docs);
    expect(entries).toHaveLength(0);
  });
});
