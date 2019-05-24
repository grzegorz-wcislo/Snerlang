defmodule Snelixir.Game do
  use GenServer
  require Logger

  ## Client API

  def start(snakes) do
    GenServer.start(__MODULE__, snakes)
  end

  def set_direction(game, snake, direction) do
    GenServer.cast(game, {:set_direction, snake, direction})
  end

  ## Server Callbacks

  def init(snakes) do
    Logger.info("Starting new game")

    Process.flag(:trap_exit, true)

    Map.keys(snakes)
    |> Enum.each(fn snake ->
      Process.link(snake)
      Snelixir.Ws.start_game(self(), snake, {snakes})
    end)

    schedule_tick()
    {:ok, Snelixir.GameLogic.init_board(Map.keys(snakes))}
  end

  def handle_cast({:set_direction, snake, direction}, board) do
    {:noreply, Snelixir.GameLogic.set_direction(board, snake, direction)}
  end

  def handle_info(:tick, board) do
    schedule_tick()
    {board, dead} = Snelixir.GameLogic.move_snakes(board)

    Enum.each(dead, fn snake -> Snelixir.Ws.lose(snake) end)

    case board |> elem(0) |> Map.keys() do
      [] ->
        Logger.info("Game is empty, exiting")
        {:stop, :normal, board}

      [snake] ->
        Logger.info("Game is won, exiting")
        Snelixir.Ws.win(snake)
        {:stop, :normal, board}

      _ ->
        board
        |> elem(0)
        |> Map.keys()
        |> Enum.each(fn snake -> Snelixir.Ws.board(snake, board) end)

        {:noreply, board}
    end
  end

  def handle_info({:EXIT, snake, _reason}, board) do
    Logger.info("Removing snake #{inspect(snake)}")
    board = Snelixir.GameLogic.remove_snake(board, snake)
    {:noreply, board}
  end

  ## Helper Functions

  defp schedule_tick do
    Process.send_after(self(), :tick, 1000)
  end
end
