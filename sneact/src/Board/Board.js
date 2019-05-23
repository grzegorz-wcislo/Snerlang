import React, { useEffect } from "react";
import "./Board.css";
import Background from "./Background";
import Apple from "./Apple";
import Snake from "./Snake";

export default ({ snakes, apples, webSocket }) => {
  useEffect(() => {
    const svg = document.getElementsByTagName("svg")[0];

    const handleKeydown = event => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const { keyCode } = event;
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

    const handleStart = event => {
      event.preventDefault();
      handleClick(event.changedTouches[0]);
    };

    const handleMouse = event => {
      event.preventDefault();
      handleClick(event);
    };

    const handleClick = ({ clientX, clientY }) => {
      const { width, height } = svg.getBoundingClientRect();

      if (clientX - clientY > 0 && clientX + clientY < height) {
        console.log("Going forward");
        webSocket.send("f");
      } else if (clientX < width / 2) {
        console.log("Going left");
        webSocket.send("l");
      } else {
        console.log("Going right");
        webSocket.send("r");
      }
    };

    window.addEventListener("keydown", handleKeydown, false);

    if ("ontouchend" in window)
      svg.addEventListener("touchend", handleStart, false);
    else svg.addEventListener("click", handleMouse, false);

    return () => {
      window.removeEventListener("keydown", handleKeydown, false);

      svg.removeEventListener("touchend", handleStart, false);
      svg.removeEventListener("click", handleMouse, false);
    };
  });

  return (
    <svg className="board" viewBox="-1 -1 25 25">
      <Background size={23} />
      {apples.map(({ x, y }) => (
        <Apple key={`ap_${x}_${y}`} {...{ x, y }} />
      ))}
      {snakes.map(({ id, name, tail }) => (
        <Snake key={id} {...{ name, tail }} />
      ))}
    </svg>
  );
};
