defmodule Snelixir.GameLogic do
  def init_board(snakes) do
    # snakes - list of pids

    # return -> initial state
    {%{}, %{}, []}
  end

  def move_snakes(board) do
    # move snakes

    # return -> {new state, list of pids of dead snakes}
    {board, []}
  end
end
