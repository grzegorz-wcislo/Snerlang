import React, { useContext } from "react";
import { GameContext } from "./Game";

export default ({ msg }) => {
  const { reset } = useContext(GameContext);

  return (
    <>
      <h1>You have been pwned :(</h1>
      <button onClick={reset}>Restart</button>
    </>
  );
};
