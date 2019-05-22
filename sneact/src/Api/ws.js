const host = process.env.REACT_APP_WS_HOST;

export const test = () => {
  const webSocket = new WebSocket(host);

  setTimeout(() => webSocket.send("Dupa 123"), 100);

  webSocket.onmessage = ({ data }) => {
    console.log(data);
  };
};

export const openConnection = (name, dispatchState) => {
  const webSocket = new WebSocket(host);
  webSocket.onopen = () => webSocket.send(name);
  webSocket.onmessage = msg => handleMessage(webSocket, msg, dispatchState);
  webSocket.onclose = () => handleClose(dispatchState);
  webSocket.onerror = () => handleError(dispatchState);
};

const handleMessage = (webSocket, { data }, dispatchState) => {
  const msg = JSON.parse(data);
  console.log(msg);
  switch (msg.type) {
    case "lobby":
      dispatchState({ type: "LOBBY", count: msg.count });
      break;
    case "init_game":
      dispatchState({ type: "GAME", ws: webSocket });
      break;
    case "board":
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

const handleClose = dispatchState => {
  dispatchState({ type: "WS_CLOSE", msg: "Connection with server closed" });
};

const handleError = dispatchState => {
  dispatchState({ type: "WS_CLOSE", msg: "Connection with server failed" });
};
