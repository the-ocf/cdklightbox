export const handlePointerHover = (e: any) => {
  // style stage container:
  const container = e.target.getStage().container();
  container.style.cursor = 'pointer';
};
export const handlePointerLeave = (e: any) => {
  const container = e.target.getStage().container();
  container.style.cursor = 'default';
};

const shortenRegex = /([\w-]*)\.(\w*$)/;

export function shorten(fqn: string) {
  const results = shortenRegex.exec(fqn);
  if (!results || !results.length) {
    return fqn;
  }
  if (results[1] === 'aws-cdk-lib') {
    return results[2];
  }
  return `${results[1]}.${results[2]}`;
}

export function getGradient(width: number, height: number, color: string) {
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
