import {
  ConstructWidgetState,
  EnumWidgetState,
  Parameter,
  StaticFunctionWidgetState,
  WorkbenchState,
} from './states';
import {
  getKey,
  isConstruct,
  isEnum,
  isLooseObject,
  isStaticFunction,
  WidgetTypeShape,
} from './widget-utils';

export function unzipIt(
  state: WorkbenchState,
  parameterProvider: (state: WorkbenchState) => Parameter
) {
  const unzipParameters = (
    parameters: ((state: WorkbenchState) => Parameter)[]
  ) => {
    parameters.forEach((parameter) => {
      unzipIt(state, parameter);
    });
  };

  const parameter = parameterProvider(state);
  if (!parameter.ref) {
    return;
  }

  const key = getKey(parameter.ref);
  const widgetState = state.widgets[key];

  // @ts-ignore
  if (widgetState.initializerParameters) {
    const keys = Object.keys(
      (widgetState as ConstructWidgetState).initializerParameters
    );
    const paramFunctions = keys
      .filter(
        // @ts-ignore
        (pk: string) => state.widgets[key].initializerParameters?.[pk]?.ref
      )
      .map((parameterKey) => {
        return (s: WorkbenchState) =>
          // @ts-ignore
          s.widgets[key].initializerParameters?.[parameterKey] as Parameter;
      });
    unzipParameters(paramFunctions);
  }

  // @ts-ignore
  if (widgetState.parameters) {
    // @ts-ignore
    const keys = Object.keys(widgetState.parameters);
    const paramFunctions = keys
      // @ts-ignore
      .filter((pk: string) => state.widgets[key].parameters?.[pk]?.ref)
      .map((parameterKey) => {
        return (s: WorkbenchState) =>
          // @ts-ignore
          s.widgets[key].parameters?.[parameterKey] as Parameter;
      });
    unzipParameters(paramFunctions);
  }

  parameter.widgetShapes = {};
  delete state.widgets[key].zipped;
}

export function zipIt(
  state: WorkbenchState,
  parameterProvider: (state: WorkbenchState) => Parameter,
  { level }: any
): Record<string, WidgetTypeShape> {
  const zipParameters = (
    parameters: ((state: WorkbenchState) => Parameter)[]
  ): Record<string, WidgetTypeShape> => {
    let additionalShapes = {};
    if (parameters) {
      parameters.forEach((parameter) => {
        additionalShapes = {
          ...additionalShapes,
          ...zipIt(state, parameter, { level: level + 1 }),
        };
      });
    }
    return additionalShapes;
  };

  const parameter = parameterProvider(state);
  if (!parameter.ref) {
    return {};
  }
  const key = getKey(parameter.ref);
  const widget = state.widgets[key];
  if (isConstruct(widget)) {
    // if the referencing object is a construct, we shouldn't do anything
    return {};
  }

  if (!parameter.widgetShapes) parameter.widgetShapes = {};
  if (isLooseObject(widget))
    parameter.widgetShapes[key] = WidgetTypeShape.LOOSE;
  if (isEnum(widget as EnumWidgetState))
    parameter.widgetShapes[key] = WidgetTypeShape.ENUM;
  if (isStaticFunction(widget as StaticFunctionWidgetState))
    parameter.widgetShapes[key] = WidgetTypeShape.STATIC_FUNCTION;

  widget.zipped = level;

  let additionalShapes = {};

  // @ts-ignore
  if (widget.initializerParameters) {
    // @ts-ignore
    const keys = Object.keys(widget.initializerParameters);
    const paramFunctions = keys
      .filter(
        // @ts-ignore
        (pk: string) => state.widgets[key].initializerParameters?.[pk]?.ref
      )
      .map((parameterKey) => {
        return (s: WorkbenchState) =>
          // @ts-ignore
          s.widgets[key].initializerParameters?.[parameterKey] as Parameter;
      });

    additionalShapes = {
      ...additionalShapes,
      ...zipParameters(paramFunctions),
    };
  }

  // @ts-ignore
  if (widget.parameters) {
    // @ts-ignore
    const keys = Object.keys(widget.parameters);
    const paramFunctions = keys
      // @ts-ignore
      .filter((pk: string) => state.widgets[key].parameters?.[pk]?.ref)
      .map((parameterKey) => {
        return (s: WorkbenchState) =>
          // @ts-ignore
          s.widgets[key].parameters?.[parameterKey] as Parameter;
      });

    additionalShapes = {
      ...additionalShapes,
      ...zipParameters(paramFunctions),
    };
  }
  parameter.widgetShapes = {
    ...parameter.widgetShapes,
    ...additionalShapes,
  };
  return parameter.widgetShapes;
}
