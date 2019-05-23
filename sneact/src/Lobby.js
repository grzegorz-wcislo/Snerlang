import React from "react";

export default ({count, fullCount}) => {
  return (
    <div className="page">
      <h1>Waiting for players</h1>
      <p>{`${count}/${fullCount}`}</p>
    </div>
  );
};
