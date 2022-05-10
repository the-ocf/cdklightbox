import { Group, Rect, Text } from 'react-konva';
import { createContext, useContext } from 'react';
import { handlePointerHover, handlePointerLeave } from './utils';
import {
  CONSTRUCT_COLOR,
  SINGLE_CORNER_RADIUS,
  WIDGET_BACKGROUND_COLOR,
} from '../colors';
import { WidgetBackground } from './WidgetBackground';
import { Tree } from '../state/substates/cdk-app-state';

const ConstructContext = createContext({} as ConstructWidgetProps);

export interface ConstructWidgetState {
  forType: string;
  id: string;

  [k: string]: any;
}

const Header = () => {
  const { tree } = useContext(ConstructContext);

  const groupHeight = 50;

  return (
    <Group height={groupHeight} x={0} y={0}>
      <Rect
        width={400}
        height={50}
        cornerRadius={SINGLE_CORNER_RADIUS}
        fillLinearGradientStartPoint={{ x: 0, y: 25 }}
        fillLinearGradientEndPoint={{ x: 400, y: 25 }}
        fillLinearGradientColorStops={[
          0,
          CONSTRUCT_COLOR,
          1,
          WIDGET_BACKGROUND_COLOR,
        ]}
      />
      <Group x={10} y={10}>
        <Text
          text={tree.constructInfo.fqn}
          fontStyle="bold"
          fontSize={14}
          textDecoration="underline"
          onMouseEnter={handlePointerHover}
          onMouseLeave={handlePointerLeave}
          fill="#222222"
        />
      </Group>
    </Group>
  );
};

export interface ConstructWidgetProps {
  tree: Tree;
}

export const ConstructWidget = (props: ConstructWidgetProps) => {
  const widgetWidth = 400;

  return (
    <ConstructContext.Provider value={props}>
      <Group draggable>
        <WidgetBackground
          width={widgetWidth}
          height={80}
          widgetColor={CONSTRUCT_COLOR}
        />

        <Header />
      </Group>
    </ConstructContext.Provider>
  );
};
