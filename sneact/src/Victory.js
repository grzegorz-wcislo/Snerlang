import React, { useContext } from "react";
import { GameContext } from "./Game";

export default ({ msg }) => {
  const { reset } = useContext(GameContext);

  return (
    <>
      <h1>You Won!!!</h1>
      <button onClick={reset}>Restart</button>
    </>
  );
};
