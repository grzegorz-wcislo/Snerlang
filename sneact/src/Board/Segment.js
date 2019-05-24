import React from "react";

export default ({ className, x, y, color }) => {
  return (
    <rect
      {...{ x, y }}
      className={`seg seg-${className}`}
      rx="0.3"
      ry="0.3"
      width="0.95"
      height="0.95"
      fill={color}
    />
  );
};
