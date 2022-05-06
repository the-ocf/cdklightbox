export const handlePointerHover = (e) => {
  // style stage container:
  const container = e.target.getStage().container();
  container.style.cursor = 'pointer';
};
export const handlePointerLeave = (e) => {
  const container = e.target.getStage().container();
  container.style.cursor = 'default';
};

export function getGradient(width, height, color) {
  let marks;
  if (height > 300) {
    marks = 0.02;
  } else if (height >= 100) {
    marks = 0.05;
  } else {
    marks = 0.15;
  }
  return {
    fillLinearGradientStartPoint: { x: width / 2, y: 0 },
    fillLinearGradientEndPoint: { x: width / 2, y: height },
    fillLinearGradientColorStops: [
      0,
      color,
      marks,
      'white',
      1 - marks,
      'white',
      1,
      color,
    ],
  };
}

export function getPosition(objectWidgetState, naturalHeight, width = 400) {
  const { x, y, zipped } = objectWidgetState;
  const calculatedHeight = zipped ? 25 : naturalHeight;
  const calculatedXPosition = zipped ? 20 * zipped.level : x;
  const calculatedYPosition = zipped ? 0 : y;
  return { calculatedHeight, calculatedXPosition, calculatedYPosition };
}

export const handleUpdatePosition = (updatePosition, objectKey) => (event) => {
  updatePosition(objectKey, { x: event.target.x(), y: event.target.y() });
};
