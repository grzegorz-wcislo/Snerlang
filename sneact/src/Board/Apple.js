import React from "react";
import Segment from "./Segment";

export default ({ x, y }) => {
  return <Segment className="apple" color="red" {...{ x, y }} />;
};
