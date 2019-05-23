import React, { useContext } from "react";
import { GameContext } from "./Game";

export default ({ msg }) => {
  const { reset } = useContext(GameContext);

  return (
    <div className="page">
      <h1>Something went wrong!</h1>
      <p>{msg}</p>
      <button onClick={reset}>Restart</button>
    </div>
  );
};
