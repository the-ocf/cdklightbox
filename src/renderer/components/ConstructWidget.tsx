import { Group, Rect, Text } from 'react-konva';
import { createContext, useContext } from 'react';
import { handlePointerHover, handlePointerLeave } from './utils';
import {
  CONSTRUCT_COLOR,
  SINGLE_CORNER_RADIUS,
  WIDGET_BACKGROUND_COLOR,
  WIDGET_COLORS,
} from '../colors';
import { WidgetBackground } from './WidgetBackground';
import { Child } from '../state/substates/cdk-app-state';
import { shorten } from '../jsii';
import { useWorkbenchStore } from '../state';

const ConstructContext = createContext({} as ConstructWidgetProps);

export interface ConstructWidgetState {
  forType: string;
  id: string;

  [k: string]: any;
}

const HEADER_HEIGHT = 50;

const Header = () => {
  const { root, level } = useContext(ConstructContext);

  const groupHeight = HEADER_HEIGHT;

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
  x: number;
  y: number;
  level: number;
}

function getPosition(index: number): { x: number; y: number } {
  const offsetX = 0;
  const offsetY = 0;
  const angle = index * 30;
  const radius = 500;
  return {
    x: offsetX + Math.cos(angle * (Math.PI / 180)) * radius,
    y: offsetY + -1 * Math.sin(angle * (Math.PI / 180)) * radius,
  };
}

function getPositionX(index: number) {
  return getPosition(index).x;
}

function getPositionY(index: number) {
  return getPosition(index).y;
}

export const ConstructWidget = (props: ConstructWidgetProps) => {
  const { root, x, y, level } = props;
  const levelFilter = useWorkbenchStore((x) => x.levelFilter);
  return (
    <ConstructContext.Provider value={props}>
      <Group draggable x={x} y={y}>
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
              .map((child, index) => (
                <ConstructWidget
                  key={child.id}
                  x={getPositionX(index)}
                  y={getPositionY(index)}
                  root={child}
                  level={level + 1}
                />
              ))
          : null}
      </Group>
    </ConstructContext.Provider>
  );
};
