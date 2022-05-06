import {
  ConstructWidgetState,
  StaticFunctionWidgetState,
  WidgetState,
  WorkbenchState,
} from '../states';
import { getRef } from '../widget-utils';
import { useWorkbenchStore } from '../zustand-state';

const createStubWidgetState = () => ({
  id: '',
  x: 0,
  y: 0,
  forType: 'somefqnname',
});

describe('update position', () => {
  it('sets x and y', () => {
    const constructKey = 'whatever';
    useWorkbenchStore.setState({
      widgets: {
        [constructKey]: createStubWidgetState(),
      },
      pickers: {},
    });

    // when
    useWorkbenchStore.getState().updatePosition(constructKey, { x: 1, y: 2 });

    // then
    const updatedState: WorkbenchState = useWorkbenchStore.getState();
    expect(updatedState.widgets[constructKey].x).toEqual(1);
    expect(updatedState.widgets[constructKey].y).toEqual(2);
  });
});

describe('update construct id', () => {
  it('sets value', () => {
    const constructKey = 'whatever';
    useWorkbenchStore.setState({
      widgets: {
        [constructKey]: createStubWidgetState(),
      },
      pickers: {},
    });

    // when
    const expected = 'something';
    useWorkbenchStore.getState().updateConstructId(constructKey, expected);

    // then
    const updatedState: WorkbenchState = useWorkbenchStore.getState();
    expect(updatedState.widgets[constructKey].id).toEqual(expected);
  });
  it("doesn't foobar anything else", () => {
    const constructKey = 'whatever';
    useWorkbenchStore.setState({
      widgets: {
        [constructKey]: { id: '', x: 0, y: 0, forType: 'whatever' },
        asdfasdf: { id: 'asdfasdf', x: 1, y: 1, forType: 'somethingelse' },
      },
      pickers: {},
    });

    // when
    const expected = 'something';
    useWorkbenchStore.getState().updateConstructId(constructKey, expected);

    // then
    const updatedState: WorkbenchState = useWorkbenchStore.getState();
    expect(updatedState.widgets).toMatchSnapshot();
  });
});

describe('addWidget', () => {
  it('adds and calls update', () => {
    const constructKey = 'whatever';
    useWorkbenchStore.setState({
      widgets: {
        [constructKey]: {
          id: '',
          initializerParameters: {},
          x: 0,
          y: 0,
          forType: 'somefqnname',
        },
      },
      pickers: {},
    });
    let newKeyCreated = '';
    const newWidget = {};

    useWorkbenchStore
      .getState()
      .addWidget(
        newWidget as WidgetState,
        (state: WorkbenchState, newKey: string) => {
          newKeyCreated = newKey;
          if (
            !(state.widgets[constructKey] as ConstructWidgetState)
              .initializerParameters
          ) {
            (
              state.widgets[constructKey] as ConstructWidgetState
            ).initializerParameters = {};
          }
          (
            state.widgets[constructKey] as ConstructWidgetState
          ).initializerParameters!.something = {
            ref: getRef(newKey),
            widgetShapes: {},
          };
        }
      );

    const updatedScope = useWorkbenchStore.getState();
    expect(
      (updatedScope.widgets[constructKey] as ConstructWidgetState)
        .initializerParameters.something.ref
    ).toEqual(getRef(newKeyCreated));
    expect(updatedScope.widgets[newKeyCreated]).toEqual(newWidget);
  });

  it('work without updater', () => {
    const constructKey = 'whatever';
    useWorkbenchStore.setState({
      widgets: {
        [constructKey]: {
          id: '',
          initializerParameters: {},
          x: 0,
          y: 0,
          forType: 'somefqnname',
        },
      },
      pickers: {},
    });

    useWorkbenchStore.getState().addWidget({} as WidgetState);

    const updatedScope = useWorkbenchStore.getState();
    expect(Object.values(updatedScope.widgets)).toHaveLength(2);
  });
});

describe('updateWidgets', function () {
  it('should set values', function () {
    const staticFunctionKey = 'whatever';
    useWorkbenchStore.setState({
      widgets: {
        [staticFunctionKey]: {
          id: '',
          parameters: {},
          x: 0,
          y: 0,
          forType: 'somefqnname',
        },
      },
      pickers: {},
    });

    useWorkbenchStore.getState().updateWidget((widgets) => {
      (
        widgets[staticFunctionKey] as StaticFunctionWidgetState
      ).parameters.whatever = { value: 'thing' };
    });
    const updatedState = useWorkbenchStore.getState();
    expect(
      (updatedState.widgets[staticFunctionKey] as StaticFunctionWidgetState)
        .parameters.whatever
    ).toEqual({ value: 'thing' });
  });
});
