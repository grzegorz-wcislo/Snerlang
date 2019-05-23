import React, { useContext } from "react";
import { GameContext } from "./Game";

export default ({ header, msg }) => {
  const { reset } = useContext(GameContext);

  return (
    <div className="page">
      {header && <h1>{header}</h1>}
      {msg && <p>{msg}</p>}
      <button onClick={reset}>Play Again</button>
    </div>
  );
};
