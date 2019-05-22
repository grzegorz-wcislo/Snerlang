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

  def start_game(game, snake, data) do
    send(snake, {:start, game, data})
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

  def websocket_handle({:text, msg}, {:game, game}) when msg in ["f", "l", "r"] do
    direction =
      case msg do
        "f" -> :front
        "l" -> :left
        "r" -> :right
      end

    Snelixir.Game.set_direction(game, self(), direction)

    {:reply, {:text, inspect(direction)}, {:game, game}}
  end

  def websocket_handle(inframe, state) do
    IO.puts("Unknown WS message #{inspect inframe} in state '#{state}'")
    {:ok, state}
  end


  def websocket_info({:send, msg}, state) do
    case JSON.encode(msg) do
      {:ok, reply} -> {:reply, {:text, reply}, state}
      {:error, reply} -> {:reply, {:text, reply}, state}
    end
  end

  def websocket_info({:start, game, data}, :lobby) do
    Process.flag(:trap_exit, true)

    case JSON.encode(data) do
      {:ok, reply} -> {:reply, {:text, reply}, {:game, game}}
      {:error, reply} -> {:reply, {:text, reply}, {:game, game}}
    end
  end

  def websocket_info({:EXIT, _game, _reason}, state) do
    IO.puts "Game died"
    {:stop, state}
  end


  def terminate(_reason, _req, _state) do
    IO.puts("#{inspect(self())}: Client disconnected")
    :ok
  end
end
