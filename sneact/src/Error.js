import React, { useContext } from "react";
import { GameContext } from "./Game";

export default ({ msg }) => {
  const { reset } = useContext(GameContext);

  return (
    <>
      <p>Something went wrong!</p>
      <p>{msg}</p>
      <button onClick={reset}>Restart</button>
    </>
  );
};
