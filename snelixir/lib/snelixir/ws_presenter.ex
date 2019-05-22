defmodule Snelixir.WsPresenter do
  def lobby_message(count) do
    JSON.encode!(%{type: :lobby, count: count})
  end

  def game_init_msg({snakes}) do
    JSON.encode!(%{type: :init_game, snakes: snakes})
  end

  def board_msg(board) do
    JSON.encode!(%{type: :board, board: board})
  end

  def win_msg do
    JSON.encode!(%{type: :victory, msg: "You won"})
  end

  def lose_msg do
    JSON.encode!(%{type: :defeat, msg: "You have been pwned"})
  end
end
