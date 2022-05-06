import { Rect } from 'react-konva';

import { WIDGET_BACKGROUND_COLOR } from '../colors';

export interface WidgetBackgroundProps {
  width: number;
  height: number;
  widgetColor: string;
}

export function WidgetBackground({
  width,
  height,
  widgetColor,
}: WidgetBackgroundProps) {
  return (
    <Rect
      width={width}
      height={height}
      fill={WIDGET_BACKGROUND_COLOR}
      cornerRadius={[5, 0, 5, 0]}
      stroke={widgetColor}
      strokeWidth={1}
    />
  );
}
