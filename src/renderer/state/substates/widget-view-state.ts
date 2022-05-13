import produce from 'immer';
import { Set, WorkbenchState } from '../states';

export interface WidgetViewState {
  position: { x: number; y: number };
  isVisible: boolean;
}

export interface WidgetsViewState {
  widgets: Record<string, WidgetViewState>;
  loadPosition(path: string): WidgetViewState;
  setWidgetViewState(
    id: string,
    widgetViewState: Partial<WidgetViewState>
  ): void;
}

export const widgetsViewState = (
  set: Set,
  get: () => WorkbenchState
): WidgetsViewState => {
  return {
    widgets: {},
    loadPosition(path: string): WidgetViewState {
      return get().widgets[path || 'root'];
    },
    setWidgetViewState(id: string, widgetViewState: WidgetViewState): void {
      set(
        produce(function (state: WorkbenchState) {
          state.widgets[id || 'root'] = {
            ...(get().widgets[id || 'root'] || {}),
            ...widgetViewState,
          };
        })
      );
    },
  };
};
