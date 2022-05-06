import { useImage } from 'react-konva-utils';
import { Rect } from 'react-konva';
import backgroundImage from './background.png';

export const WorkbenchBackground = () => {
  const [image] = useImage(backgroundImage);

  return (
    <Rect
      x={-5000}
      y={-5000}
      width={10000}
      height={10000}
      fillPatternImage={image}
      fillPatternRepeat="repeat"
    />
  );
};

export default WorkbenchBackground;
