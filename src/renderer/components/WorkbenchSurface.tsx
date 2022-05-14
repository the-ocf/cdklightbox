import { Layer, Stage } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { useWorkbenchStore } from '../state';

import { WorkbenchBackground } from './WorkbenchBackground';
import { ConstructWidget } from './ConstructWidget';
import { LevelFilter } from './LevelFilter';
import { ScaleContext, StageRefContext } from './Contexts';
import KonvaEventObject = Konva.KonvaEventObject;

export function WorkbenchSurface() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const setPosition = useWorkbenchStore((state) => state.setWorkbenchPosition);
  const setScale = useWorkbenchStore((state) => state.setScale);
  const position = useWorkbenchStore((state) => state.workbenchPosition);
  const scale = useWorkbenchStore((state) => state.scale);
  const tree = useWorkbenchStore((state) => state.cdkApp?.tree);

  const stageRef: any = useRef();

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.02;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    let direction = e.evt.deltaY < 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    if (newScale > 1) {
      newScale = 1;
    }
    if (newScale < 0.25) {
      newScale = 0.25;
    }
    setScale(newScale);
    setPosition({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };
  useEffect(() => {
    const checkSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleOnDragEnd = (event: KonvaEventObject<DragEvent>) => {
    event.cancelBubble = true;
    setPosition({ x: event.target.x(), y: event.target.y() });
  };

  return (
    <div style={{ flex: 'auto', display: 'flex' }}>
      <Stage
        width={size.width}
        height={size.height}
        onWheel={handleWheel}
        scaleX={scale}
        scaleY={scale}
        x={position.x || 0}
        y={position.y || 0}
        draggable
        onDragMove={handleOnDragEnd}
        ref={stageRef}
      >
        <StageRefContext.Provider value={stageRef}>
          <ScaleContext.Provider value={scale}>
            <Layer id="background">
              <WorkbenchBackground />
            </Layer>
            <Layer>
              <ConstructWidget root={tree} level={1} index={0} />
            </Layer>
          </ScaleContext.Provider>
        </StageRefContext.Provider>
      </Stage>

      <LevelFilter />
    </div>
  );
}
