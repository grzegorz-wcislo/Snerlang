import React, { useEffect } from "react";
import addNavigation from "./navigation";
import "./Board.css";
import Background from "./Background";
import Apple from "./Apple";
import Snake from "./Snake";

const transposeBoard = ({ snakes, apples, boardSize, id }) => {
  const s = snakes.map(snake => ({
    ...snake,
    color: id === snake.id ? "mediumseagreen" : "limegreen",
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
    <svg className="board" viewBox={`-1 -1 ${boardSize + 2} ${boardSize + 2}`}>
      <Background size={boardSize} />
      {a.map(({ x, y }) => (
        <Apple key={`ap_${x}_${y}`} {...{ x, y }} />
      ))}
      {s.map(({ id, name, tail, color }) => (
        <Snake key={id} {...{ name, tail, color }} />
      ))}
    </svg>
  );
};
