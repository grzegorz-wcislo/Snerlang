defmodule Snelixir.Ws do
  @behaviour :cowboy_websocket

  ## Client API

  def message(snake, msg) do
    # case JSON.encode(msg) do
    #   {:ok, r} -> send(snake, {:send, r})
    #   err -> IO.puts err
    # end
    send(snake, {:send, msg})
  end

  ## Websocket Callbacks

  def init(req, opts) do
    {:cowboy_websocket, req, opts}
  end


  def websocket_init(state) do
    IO.puts("#{inspect(self())}: New client connected, #{inspect(state)}")
    {:reply, {:text, "Connected"}, state}
  end


  def websocket_handle({:text, name}, :init) do
    reply = "Hi, #{name}!"
    response = Snelixir.Lobby.add(name)

    IO.puts response
    IO.puts reply

    case JSON.encode(%{response: reply}) do
      {:ok, r} -> {:reply, {:text, r}, :lobby}
    end
  end

  def websocket_handle({:text, "l"}, :game) do
    {:reply, {:text, "Going left"}, :game}
  end

  def websocket_handle({:text, "r"}, :game) do
    {:reply, {:text, "Going right"}, :game}
  end

  def websocket_handle({:text, msg}, :lobby) when msg in ["l", "r", "u", "d"] do
    reply =
      case msg do
        "l" -> "Snek #{inspect(self())} is going left"
        "r" -> "Snek #{inspect(self())} is going right"
        "u" -> "Snek #{inspect(self())} is going up"
        "d" -> "Snek #{inspect(self())} is going down"
      end

    IO.puts(reply)
    {:ok, r} = JSON.encode(%{response: reply})
    {:reply, {:text, r}, :lobby}
  end

  def websocket_handle(inframe, state) do
    IO.puts("Unknown message #{inspect inframe} in state '#{state}'")
    {:ok, state}
  end


  def websocket_info({:send, msg}, state) do
    case JSON.encode(msg) do
      {:ok, reply} -> {:reply, {:text, reply}, state}
      {:error, reply} -> {:reply, {:text, reply}, state}
    end
  end


  def terminate(_reason, _req, _state) do
    IO.puts("#{inspect(self())}: Client disconnected")
    :ok
  end
end
