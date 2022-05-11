import { useWorkbenchStore } from '../state';

export function LevelFilter() {
  const levelFilter = useWorkbenchStore((x) => x.levelFilter);
  const setLevelFilter = useWorkbenchStore((x) => x.setLevelFilter);

  const handleOnDownClick = () => setLevelFilter(Math.max(1, levelFilter - 1));
  return (
    <div
      className=""
      style={{ position: 'absolute', right: 0, bottom: '10px' }}
    >
      <button type="button" onClick={() => setLevelFilter(levelFilter + 1)}>
        UP
      </button>
      <span>{levelFilter}</span>
      <button type="button" onClick={handleOnDownClick}>
        DOWN
      </button>
    </div>
  );
}
