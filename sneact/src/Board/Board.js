import React, { useEffect } from "react";
import addNavigation from "./navigation";
import "./Board.css";
import Background from "./Background";
import Apple from "./Apple";
import Snake from "./Snake";

const transposeBoard = ({ snakes, apples, boardSize, id }) => {
  if (snakes.length === 0) return { snakes, apples };

  const { x: cX, y: cY } = snakes.filter(snake => id === snake.id)[0].tail[0];

  const s = snakes.map(snake => ({
    ...snake,
    tail: snake.tail.map(({ x, y }) => ({
      x: Math.floor(x - cX + 1.5 * boardSize) % boardSize,
      y: Math.floor(y - cY + 1.5 * boardSize) % boardSize,
    })),
    your: id === snake.id,
  }));

  return { snakes: s, apples };
};

export default ({ snakes, apples, boardSize, id, webSocket }) => {
  useEffect(() => addNavigation(webSocket));

  const { snakes: s, apples: a } = transposeBoard({
    snakes,
    apples,
    boardSize,
    id,
  });

  return (
    <svg
      className="board"
      viewBox={`-1 -1 ${boardSize + 2} ${boardSize + 2}`}
    >
      <Background size={boardSize} />
      {a.map(({ x, y }) => (
        <Apple key={`ap_${x}_${y}`} {...{ x, y }} />
      ))}
      {s.map(({ id, name, tail, your }) => (
        <Snake key={id} {...{ name, tail, your }} />
      ))}
    </svg>
  );
};
