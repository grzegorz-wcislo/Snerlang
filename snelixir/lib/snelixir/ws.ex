defmodule Snelixir.Ws do
  @behaviour :cowboy_websocket
  require Logger

  ## Client API

  def message(snake, msg) do
    send(snake, {:send, msg})
  end

  def lobby(snake, count) do
    msg = Snelixir.WsPresenter.lobby_message(count)
    send(snake, {:send, msg})
  end

  def start_game(game, snake, data) do
    msg = Snelixir.WsPresenter.game_init_msg(data)
    send(snake, {:start, game, msg})
  end

  def board(snake, board) do
    msg = Snelixir.WsPresenter.board_msg(board)
    send(snake, {:send, msg})
  end

  def win(snake) do
    msg = Snelixir.WsPresenter.win_msg
    send(snake, {:send, msg})
    send(snake, :stop)
  end

  def lose(snake) do
    msg = Snelixir.WsPresenter.lose_msg
    send(snake, {:send, msg})
    send(snake, :stop)
  end


  ## Websocket Callbacks

  def init(req, opts) do
    {:cowboy_websocket, req, opts}
  end


  def websocket_init(state) do
    Logger.info "#{inspect(self())}: New client connected"
    {:ok, state}
  end


  def websocket_handle({:text, name}, :init) do
    Snelixir.Lobby.add(name)
    {:ok, :lobby}
  end

  def websocket_handle({:text, msg}, {:game, game}) when msg in ["f", "l", "r"] do
    direction = case msg do
                  "f" -> :front
                  "l" -> :left
                  "r" -> :right
                end
    Snelixir.Game.set_direction(game, self(), direction)
    {:ok, {:game, game}}
  end

  def websocket_handle(inframe, state) do
    Logger.warn "Unknown WS message #{inspect inframe} in state '#{inspect state}'"
    {:ok, state}
  end


  def websocket_info({:send, msg}, state) do
    {:reply, {:text, msg}, state}
  end

  def websocket_info({:start, game, msg}, :lobby) do
    Process.flag(:trap_exit, true)
    {:reply, {:text, msg}, {:game, game}}
  end

  def websocket_info({:EXIT, _game, _reason}, state) do
    {:stop, state}
  end

  def websocket_info(:stop, state) do
    {:stop, state}
  end


  def terminate(reason, _req, _state) do
    case reason do
      :stop -> Logger.info "#{inspect self()}: Client stopped"
      :remote -> Logger.info "#{inspect self()}: Client disconnected"
      _ -> Logger.warn "#{inspect self()}: Client disconnected, reason: #{inspect reason}"
    end
    :ok
  end
end
