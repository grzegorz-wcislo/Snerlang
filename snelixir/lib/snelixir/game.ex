defmodule Snelixir.Game do
  use GenServer

  ## Client API

  def start(snakes) do
    GenServer.start(__MODULE__, snakes)
  end

  ## Server Callbacks

  def init(snakes) do
    IO.puts "Starting new game"
    IO.puts map_size(snakes)
    Process.flag(:trap_exit, true)

    Map.keys(snakes)
    |> Enum.each(fn snake ->
      IO.puts "dupa"
      # IO.puts snake
      Process.link(snake)
      Snelixir.Ws.message(snake, "Starting game")
    end)

    {:ok, Snelixir.GameLogic.init_board(snakes)}
  end
end
