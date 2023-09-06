import type { BoardModel, Pos } from 'src/types/types';

export const fixTransform = (
  display: Pos,
  TO_CENTER_WIDTH: number,
  TO_CENTER_HEIGHT: number,
  board: BoardModel,
  transform: Pos
) => {
  const boardTransform = { x: 0, y: 0 };
  const displayTransform = { x: 0, y: 0 };

  const handleX = () => {
    if (transform.x === 1) {
      if (
        [display.x <= board[0].length - TO_CENTER_WIDTH, display.x >= TO_CENTER_WIDTH].every(
          Boolean
        )
      ) {
        boardTransform.x = transform.x;
      } else {
        displayTransform.x = -transform.x;
      }
    }

    if (transform.x === -1) {
      if (
        [
          display.x <= board[0].length - 1 - TO_CENTER_WIDTH,
          display.x >= TO_CENTER_WIDTH - 1,
        ].every(Boolean)
      ) {
        boardTransform.x = transform.x;
      } else {
        displayTransform.x = -transform.x;
      }
    }
  };

  const handleY = () => {
    if (transform.y === 1) {
      if (
        [display.y <= board.length - TO_CENTER_HEIGHT, display.y >= TO_CENTER_HEIGHT].every(Boolean)
      ) {
        boardTransform.y = transform.y;
      } else {
        displayTransform.y = -transform.y;
      }
    }

    if (transform.y === -1) {
      if (
        [display.y <= board.length - 1 - TO_CENTER_HEIGHT, display.y >= TO_CENTER_HEIGHT - 1].every(
          Boolean
        )
      ) {
        boardTransform.y = transform.y;
      } else {
        displayTransform.y = -transform.y;
      }
    }
  };

  const handleBorder = () => {
    if (display.x === 0) {
      displayTransform.x = 0;
      // Math.min(0, displayTransform.x);
    }
    if (display.x === board[0].length - 1) {
      displayTransform.x = 0;
      // Math.max(0, displayTransform.x);
    }
    if (display.y === 0) {
      displayTransform.y = 0;
      // Math.min(0, displayTransform.y);
    }
    if (display.y === board.length - 1) {
      displayTransform.y = 0;
      // Math.max(0, displayTransform.y);
    }
  };
  handleX();
  handleY();
  handleBorder();
  return { boardTransform, displayTransform };
};
