defmodule Snelixir.Game do
  use GenServer

  ## Client API

  def start(snakes) do
    GenServer.start(__MODULE__, snakes)
  end

  def set_direction(game, snake, direction) do
    GenServer.cast(game, {:set_direction, snake, direction})
  end


  ## Server Callbacks

  def init(snakes) do
    IO.puts "Starting new game"
    IO.puts map_size(snakes)

    Map.keys(snakes)
    |> Enum.each(fn snake ->
      Process.link(snake)
      Snelixir.Ws.start_game(self(), snake, {snakes})
    end)

    schedule_tick()
    {:ok, Snelixir.GameLogic.init_board(snakes)}
  end

  def handle_cast({:set_direction, snake, direction}, board) do
    {:noreply, Snelixir.GameLogic.set_direction(board, snake, direction)}
  end


  def handle_info(:tick, board) do
    schedule_tick()
    {board, _dead} = Snelixir.GameLogic.move_snakes(board)

    board
    |> elem(0)
    |> Map.keys
    |> Enum.each(fn snake -> Snelixir.Ws.board(snake, board) end)

    IO.inspect board
    {:noreply, board}
  end

  def handle_info({:EXIT, _snake, _reason}, board) do
    {:noreply, board}
  end


  ## Helper Functions

  defp schedule_tick do
    Process.send_after(self(), :tick, 1000)
  end
end
