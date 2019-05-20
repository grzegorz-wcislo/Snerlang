import React, { useContext } from "react";
import { GameContext } from "./Game";

export default () => {
  const { startGame, registerError } = useContext(GameContext);

  return (
    <div>
      <p>Loading...</p>
      <button type="button" onClick={() => startGame("foo_ws")}>
        Connect Websocket
      </button>
      <button
        type="button"
        onClick={() => registerError("Websocket connection failed")}
      >
        Fail
      </button>
    </div>
  );
};
