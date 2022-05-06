import { Layer, Stage } from 'react-konva';
import { createContext, useEffect, useRef, useState } from 'react';
import { useWorkbenchStore } from '../state';

import { WorkbenchBackground } from './WorkbenchBackground';
import { ConstructWidget } from './ConstructWidget';

export const StageRefContext = createContext({} as any);
export const ScaleContext = createContext({} as any);

export function WorkbenchSurface() {
  const [app] = useState({});
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [scale, setScale] = useState({ stageScale: 1, stageX: 0, stageY: 0 });
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
    setScale({
      stageScale: newScale,
      stageX:
        -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      stageY:
        -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };
  useEffect(() => {
    const checkSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const widgets = useWorkbenchStore((state) =>
    Object.entries(state.widgets).filter(
      ([, widgetState]) => !widgetState.zipped
    )
  );

  return (
    <div style={{ flex: 'auto', display: 'flex' }}>
      <Stage
        width={size.width}
        height={size.height}
        onWheel={handleWheel}
        scaleX={scale.stageScale}
        scaleY={scale.stageScale}
        x={scale.stageX}
        y={scale.stageY}
        draggable
        ref={stageRef}
      >
        <StageRefContext.Provider value={stageRef}>
          <ScaleContext.Provider value={scale}>
            <Layer id="background">
              <WorkbenchBackground />
            </Layer>
            <Layer>
              {widgets.map(([widgetKey, widgetState]) => (
                <ConstructWidget
                  key={widgetKey}
                  constructKey={widgetKey}
                  constructWidgetState={widgetState}
                />
              ))}
            </Layer>
          </ScaleContext.Provider>
        </StageRefContext.Provider>
      </Stage>
    </div>
  );
}
