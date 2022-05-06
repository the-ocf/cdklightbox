import { Group, Rect, Text } from 'react-konva';
import { createContext, useContext, useState } from 'react';
import { Html } from 'react-konva-utils/es/html';
import { handlePointerHover, handlePointerLeave } from './utils';
import { shorten } from '../jsii';

import { useWorkbenchStore } from '../state';
import {
  CONSTRUCT_COLOR,
  SINGLE_CORNER_RADIUS,
  WIDGET_BACKGROUND_COLOR,
} from '../colors';
import { WidgetBackground } from './WidgetBackground';

const ConstructContext = createContext({} as ConstructWidgetProps);

export interface ConstructWidgetState {
  forType: string;
  id: string;
}

const Header = () => {
  const {
    constructWidgetState: { forType, id },
    constructKey: key,
  } = useContext(ConstructContext);

  const updateConstructId = useWorkbenchStore(
    (state) => state.updateConstructId
  );

  const [isEditing, setIsEditing] = useState(!id);
  const handleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = (event: any) => {
    // updateId(event.target.id);
    updateConstructId(key, event.target.value);
  };
  const handleBlur = () => {
    setIsEditing(!id);
  };
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
        {isEditing ? (
          <Html groupProps={{ y: -10 }}>
            <input
              type="text"
              onSubmit={handleUpdate}
              onBlur={handleBlur}
              value={id}
              onChange={handleUpdate}
            />
          </Html>
        ) : (
          <Text
            text={id}
            fontStyle="bold"
            fontSize={14}
            textDecoration="underline"
            onMouseEnter={handlePointerHover}
            onMouseLeave={handlePointerLeave}
            onClick={handleEditing}
            onTap={handleEditing}
            visible={!isEditing}
            fill="#222222"
          />
        )}
      </Group>
      <Text
        text={shorten(forType)}
        x={10}
        y={30}
        fontStyle="bold"
        fontSize={10}
        fill="#383838"
      />
    </Group>
  );
};

export interface ConstructWidgetProps {
  constructWidgetState: ConstructWidgetState;
  constructKey: string;
}

export const ConstructWidget = (props: ConstructWidgetProps) => {
  const { constructWidgetState, constructKey } = props;

  const updatePosition = useWorkbenchStore((state) => state.updatePosition);

  const handleDragEnd = (event: any) => {
    updatePosition(constructKey, { x: event.target.x(), y: event.target.y() });
  };

  const widgetWidth = 400;

  return (
    <ConstructContext.Provider value={props}>
      <Group
        x={constructWidgetState.x}
        y={constructWidgetState.y}
        draggable
        onDragEnd={handleDragEnd}
      >
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
