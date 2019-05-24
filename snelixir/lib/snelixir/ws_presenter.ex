defmodule Snelixir.WsPresenter do
  def lobby_message(snake, count) do
    JSON.encode!(%{
      type: :lobby,
      id: snake,
      count: count,
      fullCount: Snelixir.GameLogic.max_snake_count()
    })
  end

  def game_init_msg({snakes}) do
    JSON.encode!(%{type: :init_game, snakes: snakes, boardSize: Snelixir.GameLogic.length()})
  end

  def board_msg({snakes, _, apples}) do
    JSON.encode!(%{type: :board, snakes: snakes, apples: apples})
  end

  def win_msg do
    JSON.encode!(%{type: :victory, header: "Victory Royale", msg: nil})
  end

  def lose_msg do
    JSON.encode!(%{type: :defeat, header: "Defeat Rustique", msg: nil})
  end
end
