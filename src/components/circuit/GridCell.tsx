import { useDroppable } from "@dnd-kit/core";
import { ROW_HEIGHT, COL_WIDTH } from "./layout";

interface GridCellProps {
  qubit: number;
  timeStep: number;
  onClick?: () => void;
}

export function GridCell({ qubit, timeStep, onClick }: GridCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${qubit}-${timeStep}`,
    data: { qubit, timeStep },
  });

  return (
    <div
      ref={setNodeRef}
      className={`grid-cell${isOver ? " is-over" : ""}`}
      style={{
        position: "absolute",
        left: timeStep * COL_WIDTH,
        top: qubit * ROW_HEIGHT,
        width: COL_WIDTH,
        height: ROW_HEIGHT,
      }}
      onClick={onClick}
      role="gridcell"
      aria-label={`q${qubit}, step ${timeStep}, empty`}
    />
  );
}
