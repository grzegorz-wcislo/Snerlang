import React, { useEffect, useReducer, createContext } from "react";
import Login from "./Login";
import Loading from "./Loading";
import Lobby from "./Lobby";
import Notification from "./Notification";
import Board from "./Board";
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
  console.log(action);
  switch (action.type) {
    case "RESET":
      return { ...state, state: "LOGIN" };
    case "LOGIN":
      return { ...state, name: action.name, state: "LOADING" };
    case "LOBBY":
      return {
        ...state,
        id: action.id,
        count: action.count,
        fullCount: action.fullCount,
        state: "LOBBY",
      };
    case "GAME":
      return {
        ...state,
        webSocket: action.webSocket,
        boardSize: action.boardSize,
        board: emptyBoard,
        state: "GAME",
      };
    case "BOARD":
      return { ...state, board: action.board, state: "GAME" };
    case "WS_CLOSE":
      if (state.state === "NOTIFICATION") return state;
      return {
        ...state,
        header: "Connection Closed",
        msg: action.msg,
        state: "NOTIFICATION",
      };
    case "NOTIFY":
      return {
        ...state,
        header: action.header,
        msg: action.msg,
        state: "NOTIFICATION",
      };
    default:
      console.warn(`Unknown action: ${action}`);
      return state;
  }
};

export const GameContext = createContext(null);

export default () => {
  const [state, dispatchState] = useReducer(stateReducer, {
    name: "",
    board: emptyBoard,
    state: "LOGIN",
  });

  const reset = () => {
    dispatchState({ type: "RESET" });
  };

  const login = name => {
    openConnection(name, dispatchState);
    dispatchState({ type: "LOGIN", name });
  };

  const registerError = msg => {
    dispatchState({ type: "NOTIFY", msg, header: "Error" });
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
        const { count, fullCount } = state;
        return <Lobby {...{ count, fullCount }} />;
      case "GAME":
        const { board, boardSize, id, webSocket } = state;
        return <Board {...{ ...board, boardSize, id, webSocket }} />;
      case "NOTIFICATION":
        const { msg, header } = state;
        return <Notification {...{ msg, header }} />;
      default:
        return <Notification header="Error" msg="Something went very wrong" />;
    }
  };

  return (
    <>
      <GameContext.Provider value={{ reset, login, registerError }}>
        {component(state.state)}
      </GameContext.Provider>
    </>
  );
};
