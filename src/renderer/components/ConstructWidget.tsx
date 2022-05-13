import { Circle, Group, Line, Rect, Text } from 'react-konva';
import { createContext, useContext } from 'react';
import Konva from 'konva';
import {
  CONSTRUCT_COLOR,
  HIDE_BUTTON,
  HIDE_BUTTON_TEXT,
  LINE_COLOR,
  SINGLE_CORNER_RADIUS,
  WIDGET_BACKGROUND_COLOR,
  WIDGET_COLORS,
} from '../colors';
import { WidgetBackground } from './WidgetBackground';
import { Child } from '../state/substates/cdk-app-state';
import { shorten } from '../jsii';
import { useWorkbenchStore } from '../state';
import { WidgetViewState } from '../state/substates/widget-view-state';
import KonvaEventObject = Konva.KonvaEventObject;

const ConstructContext = createContext({} as ConstructWidgetProps);

export interface ConstructWidgetState {
  forType: string;
  id: string;

  [k: string]: any;
}

const HEADER_HEIGHT = 50;

const Header = () => {
  const { root, level } = useContext(ConstructContext);
  const setWidgetViewState = useWorkbenchStore(
    (state) => state.setWidgetViewState
  );
  const groupHeight = HEADER_HEIGHT;
  const hideWidget = () => {
    setWidgetViewState(root.path, { isVisible: false });
  };
  return (
    <Group height={groupHeight} x={0} y={0}>
      <Rect
        width={200}
        height={50}
        cornerRadius={SINGLE_CORNER_RADIUS}
        fillLinearGradientStartPoint={{ x: 0, y: 25 }}
        fillLinearGradientEndPoint={{ x: 400, y: 25 }}
        fillLinearGradientColorStops={[
          0,
          WIDGET_COLORS[level],
          1,
          WIDGET_BACKGROUND_COLOR,
        ]}
      />
      <Group
        x={180}
        y={25}
        height={50}
        width={20}
        onClick={hideWidget}
        onTap={hideWidget}
      >
        <Circle radius={15} fill={HIDE_BUTTON} />
        <Text text="x" y={-5} x={-3} fill={HIDE_BUTTON_TEXT} />
      </Group>

      <Group x={10} y={10}>
        <Text
          text={shorten(root.id)}
          fontStyle="bold"
          fontSize={14}
          textDecoration="underline"
          fill="#222222"
        />
        <Text
          y={16}
          text={shorten(root.constructInfo.fqn)}
          fontStyle="bold"
          fontSize={12}
          fill="#222222"
        />
      </Group>
    </Group>
  );
};

export interface ConstructWidgetProps {
  root: Child;
  level: number;
  index: number;
  scopeX?: number;
  scopeY?: number;
}

function getPosition(index: number): WidgetViewState {
  const offsetX = 0;
  const offsetY = 0;
  const angle = index * 30;
  const radius = 500;
  return {
    position: {
      x: offsetX + Math.cos(angle * (Math.PI / 180)) * radius,
      y: offsetY + -1 * Math.sin(angle * (Math.PI / 180)) * radius,
    },
    isVisible: true,
  };
}

export const ConstructWidget = (props: ConstructWidgetProps) => {
  const { root, index, level, scopeX, scopeY } = props;

  const levelFilter = useWorkbenchStore((x) => x.levelFilter);
  const loadPosition = useWorkbenchStore((x) => x.loadPosition);
  const setWidgetViewState = useWorkbenchStore((x) => x.setWidgetViewState);
  const { position, isVisible } = loadPosition(root.path) ?? getPosition(index);
  const { x, y } = position;
  const handleOnDragEnd = (event: KonvaEventObject<DragEvent>) => {
    event.cancelBubble = true;
    setWidgetViewState(root.path, {
      isVisible: true,
      position: { x: event.target.x(), y: event.target.y() },
    });
  };
  return isVisible ? (
    <ConstructContext.Provider value={props}>
      <Group draggable x={x} y={y} onDragMove={handleOnDragEnd}>
        {scopeX && scopeY ? (
          <Line
            stroke={LINE_COLOR}
            width={3}
            points={[
              -x + 200,
              -y + 100 + HEADER_HEIGHT / 2,
              100,
              100 + HEADER_HEIGHT / 2,
            ]}
          />
        ) : null}
        <WidgetBackground
          width={200}
          height={200 + HEADER_HEIGHT}
          widgetColor={CONSTRUCT_COLOR}
        />
        <Header />

        {root.children && level <= levelFilter
          ? Object.values(root.children)
              .filter((child) => child.id !== 'Tree')
              .filter((child) => child.id !== 'CDKMetadata')
              .map((child, i) => (
                <ConstructWidget
                  key={child.id}
                  root={child}
                  index={i}
                  level={level + 1}
                  scopeX={x}
                  scopeY={y}
                />
              ))
          : null}
      </Group>
    </ConstructContext.Provider>
  ) : null;
};
