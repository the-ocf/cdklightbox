import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import { useWorkbenchStore } from '../state';

export function LevelFilter() {
  const levelFilter = useWorkbenchStore((x) => x.levelFilter);
  const setLevelFilter = useWorkbenchStore((x) => x.setLevelFilter);
  const showHidden = useWorkbenchStore((x) => x.showHidden);
  const setShowHidden = useWorkbenchStore((x) => x.setShowHidden);
  return (
    <div
      className="bg-white flex flex-row items-center rounded-md"
      style={{ position: 'absolute', right: '10px', bottom: '10px' }}
    >
      <span className="flex-grow px-2">Show Hidden:</span>
      <input
        className="mr-2"
        type="checkbox"
        onChange={(event) => {
          setShowHidden(event.target.checked);
        }}
        checked={showHidden}
      />
      <div className="mx-2 flex flex-row items-center">
        <span>Level Filter:</span>
        <span className="mx-2">{levelFilter}</span>
        <button
          className="mx-2"
          type="button"
          onClick={() => setLevelFilter(levelFilter + 1)}
        >
          <AiOutlineArrowUp />
        </button>
        <button
          className="mx-2"
          type="button"
          onClick={() => setLevelFilter(levelFilter - 1)}
        >
          <AiOutlineArrowDown />
        </button>
      </div>
    </div>
  );
}
