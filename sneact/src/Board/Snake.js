import React from "react";
import Segment from "./Segment";

export default ({ name, tail, your }) => {
  return (
    <>
      {tail.map(({ x, y }) => (
        <Segment
          key={`tl_${x}_${y}`}
          className={your ? "your-snake" : "snake"}
          {...{ x, y }}
        />
      ))}
      <text y={tail[0].y - 0.2} x={tail[0].x + 0.5}>
        {name}
      </text>
    </>
  );
};
