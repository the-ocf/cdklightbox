import { Group, Image, Line, Rect, Text } from 'react-konva';
import { createContext, useContext } from 'react';
import Konva from 'konva';
import { useImage } from 'react-konva-utils';
import {
  CONSTRUCT_COLOR,
  HIDE_BUTTON_IS_VISIBLE_STROKE_COLOR,
  LINE_COLOR,
  SHOW_BUTTON_IS_VISIBLE_STROKE_COLOR,
  SINGLE_CORNER_RADIUS,
  WIDGET_BACKGROUND_COLOR,
  WIDGET_COLORS,
} from '../colors';
import { WidgetBackground } from './WidgetBackground';
import { Child } from '../state/substates/cdk-app-state';
import { useWorkbenchStore } from '../state';
import { WidgetViewState } from '../state/substates/widget-view-state';
import hideImage from './assets/hide-svgrepo-com.svg';
import showImage from './assets/show-svgrepo-com.svg';
import { shorten } from './utils';
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
  const widgetViewState = useWorkbenchStore(
    (state) => state.widgets[root.path || 'root']
  ) ?? { isVisible: true };
  const [hideIcon] = useImage(hideImage);
  const [showIcon] = useImage(showImage);

  const groupHeight = HEADER_HEIGHT;
  const toggleWidget = (event: KonvaEventObject<MouseEvent>) => {
    console.debug('Toggling visibility');
    event.cancelBubble = true;

    setWidgetViewState(root.path, {
      position: widgetViewState.position,
      isVisible: !widgetViewState.isVisible,
    });
  };
  const handleCursor = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (stage) {
      if (e.type === 'mouseenter') {
        stage.container().style.cursor = 'pointer';
      } else {
        stage.container().style.cursor = 'default';
      }
    }
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
        x={175}
        y={25}
        height={50}
        width={20}
        onClick={toggleWidget}
        onTap={toggleWidget}
      >
        <Image
          image={widgetViewState.isVisible ? showIcon : hideIcon}
          height={30}
          width={30}
          x={-15}
          y={-15}
          onMouseEnter={handleCursor}
          onMouseLeave={handleCursor}
          fill={
            widgetViewState.isVisible
              ? SHOW_BUTTON_IS_VISIBLE_STROKE_COLOR
              : HIDE_BUTTON_IS_VISIBLE_STROKE_COLOR
          }
          shadowOffsetY={1}
          shadowOffsetX={1}
          shadowBlur={2}
          shadowColor="black"
          strokeWidth={2}
        />
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
  // eslint-disable-next-line react/require-default-props
  scopeX?: number;
  // eslint-disable-next-line react/require-default-props
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
  const showHidden = useWorkbenchStore((x) => x.showHidden);
  const { position, isVisible } = loadPosition(root.path) ?? getPosition(index);
  const { x, y } = position ?? {};
  const handleOnDrag = (event: KonvaEventObject<DragEvent>) => {
    event.cancelBubble = true;
    setWidgetViewState(root.path, {
      position: { x: event.target.x(), y: event.target.y() },
    });
  };

  const calculateCenter = () => {
    return [100, 100 + HEADER_HEIGHT / 2];
  };

  const calculateLineStart = () => {
    // if we're to the right of the parent
    if (x > 100) {
      const startX = -x + 200;
      const startY = -y + 100 + HEADER_HEIGHT / 2;
      return [startX, startY];
    }
    // we're to the left of the parent
    if (x < -200) {
      return [-x, -y + 100 + HEADER_HEIGHT / 2];
    }
    // if we're below the parent
    if (y > 0) {
      return [-x + 100, -y + 200 + HEADER_HEIGHT];
    }
    // otherwise go out the top
    return [-x + 100, -y];
  };
  return isVisible || showHidden ? (
    <ConstructContext.Provider value={props}>
      <Group draggable x={x} y={y} onDragMove={handleOnDrag}>
        {scopeX !== undefined && scopeY !== undefined ? (
          <Line
            stroke={LINE_COLOR}
            width={3}
            points={[...calculateLineStart(), ...calculateCenter()]}
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
