import React from "react";
import Segment from "./Segment";

export default ({ size }) => {
  const indices = [...Array(size).keys()];
  return (
    <>
      {indices.map(x =>
        indices.map(y => (
          <Segment key={`bg_${x}+${y}`} className="bg" {...{ x, y }} />
        ))
      )}
    </>
  );
};
