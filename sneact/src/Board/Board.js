import React from "react";
import "./Board.css";
import Background from "./Background";
import Apple from "./Apple";
import Snake from "./Snake";

export default ({ snakes, apples }) => {
  return (
    <svg className="board" viewBox="-1 -1 23 23">
      <Background size={21} />
      {apples.map(({ x, y }) => (
        <Apple key={`ap_${x}_${y}`} {...{ x, y }} />
      ))}
      {snakes.map(({ name, tail }) => (
        <Snake key={name} {...{ name, tail }} />
      ))}
    </svg>
  );
};
