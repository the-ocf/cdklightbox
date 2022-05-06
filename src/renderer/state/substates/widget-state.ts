import { nanoid } from 'nanoid';
import produce from 'immer';
import {
  AnyWidgetState,
  ConstructWidgetState,
  StaticFunctionWidgetState,
  WidgetState,
  WorkbenchState,
  Set,
} from '../states';

export interface WidgetsState {
  widgets: Record<string, AnyWidgetState>;

  updateWidget(
    updater: (
      widgets:
        | Record<string, WidgetState>
        | Record<string, StaticFunctionWidgetState>
        | Record<string, ConstructWidgetState>
    ) => void
  ): void;

  addWidget(
    newWidget: WidgetState,
    refUpdater?: (state: WorkbenchState, newKey: string) => void
  ): void;

  updateConstructId(widgetKey: string, newId: string): void;

  updatePosition(widgetKey: string, position: { x: number; y: number }): void;
}

// @ts-ignore we're not going to care for now until we can have a better type for App
const app: WidgetState = {};

const newStack: ConstructWidgetState = {
  id: 'MyStack',
  scope: app,
  x: 100,
  y: 100,
  forType: '@aws-cdk/core.Stack',
  initializerParameters: {},
};

const newInstance: ConstructWidgetState = {
  scope: newStack,
  id: 'MyInstance',
  x: 600,
  y: 100,
  forType: '@aws-cdk/aws-ec2.Instance',
  initializerParameters: {},
};
export const widgetsState = (set: Set): WidgetsState => ({
  widgets: {
    [nanoid()]: newStack,
    [nanoid()]: newInstance,
  },

  addWidget: (
    newWidget: WidgetState,
    refUpdater?: (state: WorkbenchState, newKey: string) => void
  ) => {
    const newKey = nanoid();
    set(
      produce((state: WorkbenchState) => {
        state.widgets = {
          ...state.widgets,
          [newKey]: newWidget,
        };
        if (refUpdater && typeof refUpdater === 'function') {
          refUpdater(state, newKey);
        }
      })
    );
  },
  updateWidget: (updater: (widgets: Record<string, WidgetState>) => void) => {
    set(
      produce((state: WorkbenchState) => {
        updater(state.widgets);
      })
    );
  },
  updateConstructId(constructKey: string, newId: string): void {
    set(
      produce((state) => {
        state.widgets[constructKey].id = newId;
      })
    );
  },
  updatePosition(widgetKey: string, { x, y }: { x: number; y: number }): void {
    set(
      produce((state) => {
        state.widgets[widgetKey].x = x;
        state.widgets[widgetKey].y = y;
      })
    );
  },
});
