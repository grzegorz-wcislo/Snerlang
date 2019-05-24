import React from "react";
import Segment from "./Segment";

export default ({ name, tail, color }) => {
  return (
    <>
      {tail.map(({ x, y }) => (
        <Segment key={`tl_${x}_${y}`} className="snake" {...{ x, y, color }} />
      ))}
      <text
        y={tail[0].y - 0.1}
        x={tail[0].x + 0.5}
        textAnchor="middle"
        fontSize="1"
      >
        {name}
      </text>
    </>
  );
};
