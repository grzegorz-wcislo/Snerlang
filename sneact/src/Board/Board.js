import React, { useEffect } from "react";
import "./Board.css";
import Background from "./Background";
import Apple from "./Apple";
import Snake from "./Snake";

export default ({ snakes, apples, webSocket }) => {
  useEffect(() => {
    const fun = ({ keyCode }) => {
      switch (keyCode) {
        case 87:
        case 38:
          webSocket.send("f");
          break;
        case 65:
        case 37:
          webSocket.send("l");
          break;
        case 68:
        case 39:
          webSocket.send("r");
          break;
        default:
      }
    };

    window.addEventListener("keydown", fun, false);
    return () => window.removeEventListener("keydown", fun, false);
  });

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
