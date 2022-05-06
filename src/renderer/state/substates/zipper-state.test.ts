import * as fs from 'fs';
import * as path from 'path';
import {
  ConstructWidgetState,
  LooseObjectWidgetState,
  StaticFunctionWidgetState,
  WorkbenchState,
} from '../states';
import { getRef, WidgetTypeShape } from '../widget-utils';
import { useWorkbenchStore } from '../zustand-state';

describe('zip', () => {
  it('moves references', () => {
    // given
    const constructKey = 'myconstruct';
    const staticFunctionKey = 'myStaticFunction';
    const otherLooseObjectKey = 'otherlooseobject';
    const vpcConstructKey = 'avpc';

    const otherConstructProps = {
      scope: {},
      id: '',
      x: 0,
      y: 0,
      forType: '',
    };
    // @ts-ignore
    const construct: ConstructWidgetState = {
      ...otherConstructProps,
      initializerParameters: {
        something: { ref: getRef(staticFunctionKey), widgetShapes: {} },
      },
    };
    const staticFunction: StaticFunctionWidgetState = {
      id: '',
      x: 0,
      y: 0,
      method: { name: '', parameters: [] },
      forType: '@aws-cdk/aws-ec2.InstanceType',
      type: 'staticFunction',
      parameters: {
        somethingElse: { ref: getRef(otherLooseObjectKey) },
        notARef: { value: 'something else' },
      },
    };
    const otherLooseObject: LooseObjectWidgetState = {
      forType: '@aws-cdk/aws-ec2.InstanceType',
      id: '',
      x: 0,
      y: 0,
      initializerParameters: {
        vpc: {
          ref: getRef(vpcConstructKey),
          widgetShapes: {},
        },
      },
    };
    const vpcConstruct: ConstructWidgetState = {
      // @ts-ignore
      scope: {},
      id: '',
      x: 0,
      y: 0,
      initializerParameters: {},
      forType: '@aws-cdk/aws-ec2.Vpc',
    };

    useWorkbenchStore.setState({
      widgets: {
        [constructKey]: construct,
        [staticFunctionKey]: staticFunction,
        [otherLooseObjectKey]: otherLooseObject,
        [vpcConstructKey]: vpcConstruct,
      },
      pickers: {},
    });

    // when
    useWorkbenchStore
      .getState()
      .zip(
        (state) =>
          (state.widgets[constructKey] as ConstructWidgetState)
            .initializerParameters.something
      );

    // then
    const updatedState: WorkbenchState = useWorkbenchStore.getState();
    expect(updatedState.widgets[staticFunctionKey]).toBeTruthy();
    expect(
      (updatedState.widgets[staticFunctionKey] as StaticFunctionWidgetState)
        .parameters.somethingElse.widgetShapes[otherLooseObjectKey]
    ).toEqual(WidgetTypeShape.LOOSE);
    expect(updatedState.widgets[otherLooseObjectKey]).toBeTruthy();
    expect(
      (updatedState.widgets[constructKey] as ConstructWidgetState)
        .initializerParameters.something.widgetShapes[staticFunctionKey]
    ).toEqual(WidgetTypeShape.STATIC_FUNCTION);
    expect(
      (updatedState.widgets[constructKey] as ConstructWidgetState)
        .initializerParameters.something.widgetShapes[otherLooseObjectKey]
    ).toEqual(WidgetTypeShape.LOOSE);
    expect(updatedState.widgets[vpcConstructKey].zipped).toBeFalsy();
  });

  it('More complete example', () => {
    const workbenchState: WorkbenchState = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, 'test_states', 'workbench.json'),
        'utf-8'
      )
    );
    // @ts-ignore
    const INSTANCE_KEY = Object.entries(workbenchState.widgets).find(
      ([, state]) => state.forType === '@aws-cdk/aws-ec2.Instance'
    )[0];
    useWorkbenchStore.setState(() => workbenchState);
    useWorkbenchStore
      .getState()
      .zip(
        (state) =>
          (state.widgets[INSTANCE_KEY] as ConstructWidgetState)
            .initializerParameters.vpc
      );

    expect(
      (
        useWorkbenchStore.getState().widgets[
          INSTANCE_KEY
        ] as ConstructWidgetState
      ).initializerParameters.vpc.widgetShapes
    ).toMatchSnapshot();
  });
});

describe('unzip', () => {
  it('moves references back', () => {
    // given
    const constructKey = 'myconstruct';
    const staticFunctionKey = 'myStaticFunction';
    const otherLooseObjectKey = 'otherlooseobject';
    const otherLooseObjectProps = {
      initializerParameters: {},
      forType: '',
      id: '',
      method: '',
      type: '',
      x: 0,
      y: 0,
    };
    const otherLooseObject: LooseObjectWidgetState = {
      ...otherLooseObjectProps,
      zipped: 2,
    };
    const otherStaticFunctionProps: Partial<StaticFunctionWidgetState> = {
      x: 0,
      y: 0,
      id: '',
      type: 'staticFunction',
      forType: 'somestaticfunctionfqn',
      method: { name: 'somemethod', parameters: [] },
    };

    // @ts-ignore
    const staticFunction: StaticFunctionWidgetState = {
      parameters: {
        somethingElse: {
          ref: getRef(otherLooseObjectKey),
          widgetShapes: { [otherLooseObjectKey]: WidgetTypeShape.LOOSE },
        },
        notARef: { value: 'something else' },
      },
      ...otherStaticFunctionProps,
      zipped: 1,
    };

    const construct: ConstructWidgetState = {
      // @ts-ignore
      scope: {},
      id: '',
      x: 0,
      y: 0,
      forType: 'someconstructsfqn',
      initializerParameters: {
        something: {
          ref: getRef(staticFunctionKey),
          widgetShapes: {
            [staticFunctionKey]: WidgetTypeShape.STATIC_FUNCTION,
          },
        },
      },
    };

    useWorkbenchStore.setState({
      widgets: {
        [constructKey]: construct,
        [staticFunctionKey]: staticFunction,
        [otherLooseObjectKey]: otherLooseObject,
      },
      pickers: {},
    });

    // when
    useWorkbenchStore
      .getState()
      .unzip(
        (state) =>
          (state.widgets[constructKey] as ConstructWidgetState)
            .initializerParameters.something
      );

    // then
    const updatedState: WorkbenchState = useWorkbenchStore.getState();
    expect(
      (updatedState.widgets[constructKey] as ConstructWidgetState)
        .initializerParameters.something.widgetShapes[staticFunctionKey]
    ).toBeUndefined();
    expect(updatedState.widgets[staticFunctionKey]).toEqual({
      parameters: {
        somethingElse: {
          ref: getRef(otherLooseObjectKey),
          widgetShapes: {},
        },
        notARef: { value: 'something else' },
      },
      ...otherStaticFunctionProps,
    });
    expect(updatedState.widgets[otherLooseObjectKey]).toEqual({
      ...otherLooseObjectProps,
    });
  });
});
