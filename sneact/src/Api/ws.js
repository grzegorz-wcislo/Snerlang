const host = process.env.REACT_APP_WS_HOST;

export const openConnection = (name, dispatchState) => {
  const webSocket = new WebSocket(host);
  webSocket.onopen = () => webSocket.send(name);
  webSocket.onmessage = msg => handleMessage(webSocket, msg, dispatchState);
  webSocket.onclose = () => handleClose(dispatchState);
  webSocket.onerror = () => handleError(dispatchState);
};

let parseBoard = () => ({ snakes: [], apples: [] });

const handleMessage = (webSocket, { data }, dispatchState) => {
  const msg = JSON.parse(data);
  switch (msg.type) {
    case "lobby":
      dispatchState({
        type: "LOBBY",
        id: msg.id,
        count: msg.count,
        fullCount: msg.fullCount,
      });
      break;
    case "init_game":
      parseBoard = parseBoardCreate(msg);
      dispatchState({
        type: "GAME",
        webSocket,
        boardSize: msg.boardSize,
      });
      break;
    case "board":
      const board = parseBoard(msg);
      dispatchState({ type: "BOARD", board });
      break;
    case "victory":
    case "defeat":
      dispatchState({ type: "NOTIFY", header: msg.header, msg: msg.msg });
      break;
    default:
      console.warn("Unknown message", data);
  }
};

const parseBoardCreate = ({ snakes: snakeNames }) => {
  return msg => {
    const { snakes, apples } = msg;
    const s = Object.keys(snakes).map(snake => {
      return {
        id: snake,
        name: snakeNames[snake],
        tail: snakes[snake].map(([x, y]) => ({ x, y })),
      };
    });
    const a = apples.map(([x, y]) => ({ x, y }));
    return { snakes: s, apples: a };
  };
};

const handleClose = dispatchState => {
  dispatchState({ type: "WS_CLOSE", msg: "Connection with server closed" });
};

const handleError = dispatchState => {
  dispatchState({ type: "WS_CLOSE", msg: "Connection with server failed" });
};
