import {
  AnyWidgetState,
  ConstructWidgetState,
  getRef,
  Parameter,
  StaticFunctionWidgetState,
  WidgetState,
  WorkbenchState,
} from '../state';
import { PickedWidget } from './Picker';

function getStackOrOpen(widgetState: WidgetState): WidgetState {
  let currentWidgetState = widgetState;
  const isStackClass = (forType: string) => forType === '@aws-cdk/core.Stack';

  while (!isStackClass(currentWidgetState.forType)) {
    currentWidgetState = currentWidgetState.scope as WidgetState;
  }
  return currentWidgetState;
}

function isStackOrOpen(widgetState: WidgetState) {
  return !!getStackOrOpen(widgetState);
}

export const handleValuePicked = (
  addWidget: (
    newWidget: WidgetState,
    refUpdater?: (state: WorkbenchState, newKey: string) => void
  ) => void,
  updateWidget: (
    updater: (
      widgets:
        | Record<string, WidgetState>
        | Record<string, StaticFunctionWidgetState>
        | Record<string, ConstructWidgetState>
    ) => void
  ) => void,
  removePicker: (picker: string) => void,
  widgetState: WidgetState,
  widgetKey: string,
  parametersProvider: (widgetState: AnyWidgetState) => Record<string, Parameter>
) => {
  return (props: PickedWidget) => {
    if (props.widget) {
      const newWidget = {
        ...props.widget,
        scope: isStackOrOpen(widgetState)
          ? widgetState.scope
          : getStackOrOpen(widgetState).scope,
      };
      addWidget(newWidget, (workbench: WorkbenchState, newKey: string) => {
        parametersProvider(workbench.widgets[widgetKey])[props.property.name] =
          {
            ref: getRef(newKey),
            widgetShapes: {},
          };
      });
    }
    if (props.value !== undefined) {
      updateWidget((widgets) => {
        const currentWidget = widgets[widgetKey];
        parametersProvider(currentWidget)[props.property.name] = {
          value: props.value,
          widgetShapes: {},
        };
      });
    }
    if (props.pickerKey) {
      removePicker(props.pickerKey);
    }
  };
};

export const handleValueZipped = (
  zip,
  unzip,
  constructKey: string,
  parametersProvider: (widgetState: AnyWidgetState) => Record<string, Parameter>
) => {
  return (prop: any, isZipped: boolean) => {
    if (isZipped) {
      zip(
        (state) => parametersProvider(state.widgets[constructKey])[prop.name]
      );
    } else {
      unzip(
        (state) => parametersProvider(state.widgets[constructKey])[prop.name]
      );
    }
  };
};
