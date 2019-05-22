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
  console.log(msg);
  switch (msg.type) {
    case "lobby":
      dispatchState({ type: "LOBBY", count: msg.count });
      break;
    case "init_game":
      parseBoard = parseBoardCreate(msg);
      dispatchState({ type: "GAME", ws: webSocket });
      break;
    case "board":
      const board = parseBoard(msg);
      dispatchState({ type: "BOARD", board });
      break;
    case "victory":
      dispatchState({ type: "WIN" });
      break;
    case "defeat":
      dispatchState({ type: "LOSE" });
      break;
    default:
      console.warn("Unknown message", data);
  }
};

const parseBoardMetadata = data => {
  console.log(data);
};

const parseBoardCreate = ({ snakes: snakeNames }) => {
  console.log(snakeNames);

  return msg => {
    const { snakes, apples } = msg;
    const s = Object.keys(snakes).map(snake => {
      return {
        id: snake,
        name: snakeNames[snake],
        tail: snakes[snake].map(([x, y]) => ({ x, y })),
      };
    });
    return { snakes: s, apples: [] };
  };
};

const handleClose = dispatchState => {
  dispatchState({ type: "WS_CLOSE", msg: "Connection with server closed" });
};

const handleError = dispatchState => {
  dispatchState({ type: "WS_CLOSE", msg: "Connection with server failed" });
};
