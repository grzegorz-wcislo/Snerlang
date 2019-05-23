import React, { useEffect, useReducer, createContext } from "react";
import Login from "./Login";
import Loading from "./Loading";
import Board from "./Board";
import Victory from "./Victory";
import Defeat from "./Defeat";
import Error from "./Error";
import { openConnection } from "./Api/ws.js";

// const response = {
//   snakes: [
//     {
//       name: "Snek1",
//       tail: [
//         { x: 20, y: 2 },
//         { x: 0, y: 2 },
//         { x: 1, y: 2 },
//         { x: 1, y: 3 },
//         { x: 1, y: 4 },
//         { x: 2, y: 4 },
//       ],
//     },
//     {
//       name: "Snek2",
//       tail: [
//         { x: 10, y: 0 },
//         { x: 10, y: 1 },
//         { x: 10, y: 2 },
//         { x: 10, y: 3 },
//         { x: 10, y: 4 },
//         { x: 10, y: 5 },
//       ],
//     },
//     {
//       name: "Snek3",
//       tail: [
//         { x: 1, y: 20 },
//         { x: 1, y: 19 },
//         { x: 2, y: 19 },
//         { x: 3, y: 19 },
//       ],
//     },
//   ],
//   apples: [{ x: 2, y: 3 }, { x: 10, y: 7 }],
// };

const emptyBoard = { snakes: [], apples: [] };

const stateReducer = (state, action) => {
  switch (action.type) {
    case "RESET":
      return { ...state, state: "LOGIN" };
    case "LOGIN":
      return { ...state, name: action.name, state: "LOADING" };
    case "LOBBY":
      return { ...state, state: "LOBBY", count: action.count };
    case "GAME":
      return { ...state, ws: action.ws, board: emptyBoard, state: "GAME" };
    case "BOARD":
      return { ...state, board: action.board, state: "GAME" };
    case "WIN":
      return { ...state, state: "VICTORY" };
    case "LOSE":
      return { ...state, state: "DEFEAT" };
    case "WS_CLOSE":
      if (state.state === "VICTORY" || state.state === "DEFEAT") return state;
      return { ...state, msg: action.msg, state: "ERROR" };
    case "ERROR":
      return { ...state, msg: action.msg, state: "ERROR" };
    default:
      console.warn(`Unknown action: ${action}`);
      return { ...state, state: "ERROR" };
  }
};

export const GameContext = createContext(null);

export default () => {
  const name = "";

  const [state, dispatchState] = useReducer(stateReducer, {
    name,
    emptyBoard,
    state: "LOGIN",
  });

  // const board = response;
  const board = state.board;

  const reset = () => {
    dispatchState({ type: "RESET" });
  };

  const login = name => {
    openConnection(name, dispatchState);
    dispatchState({ type: "LOGIN", name });
  };

  const startGame = ws => {
    dispatchState({ type: "GAME", ws });
  };

  const win = () => {
    dispatchState({ type: "WIN" });
  };

  const lose = () => {
    dispatchState({ type: "LOSE" });
  };

  const registerError = msg => {
    dispatchState({ type: "ERROR", msg });
  };

  useEffect(() => {
    console.log(state);
  });

  const component = s => {
    switch (s) {
      case "LOGIN":
        const { name } = state;
        return <Login {...{ name }} />;
      case "LOADING":
        return <Loading />;
      case "LOBBY":
        return <p>{state.count}</p>;
      case "GAME":
        return (
          <>
            <Board {...board} webSocket={state.ws} />
            <button onClick={win}>Win</button>
            <button onClick={lose}>Lose</button>
          </>
        );
      case "VICTORY":
        return <Victory />;
      case "DEFEAT":
        return <Defeat />;
      case "ERROR":
        const { msg } = state;
        return <Error {...{ msg }} />;
      default:
        return <Error msg="Something went very wrong" />;
    }
  };

  return (
    <>
      <GameContext.Provider
        value={{ reset, login, startGame, win, lose, registerError }}
      >
        {component(state.state)}
      </GameContext.Provider>
    </>
  );
};
