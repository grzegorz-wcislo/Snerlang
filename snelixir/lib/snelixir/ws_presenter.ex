defmodule Snelixir.WsPresenter do
  def lobby_message(snake, count) do
    JSON.encode!(%{
      type: :lobby,
      id: pid_to_id(snake),
      count: count,
      fullCount: Snelixir.GameLogic.max_snake_count()
    })
  end

  def game_init_msg({snakes}) do
    JSON.encode!(%{
      type: :init_game,
      snakes: snake_map_view(snakes),
      boardSize: Snelixir.GameLogic.length()
    })
  end

  def board_msg({snakes, _, apples}) do
    JSON.encode!(%{
      type: :board,
      snakes: snake_map_view(snakes),
      apples: apples
    })
  end

  def win_msg do
    JSON.encode!(%{type: :victory, header: "Victory Royale", msg: nil})
  end

  def lose_msg do
    JSON.encode!(%{type: :defeat, header: "Defeat Rustique", msg: nil})
  end

  defp snake_map_view(snakes) do
    for {snake_pid, value} <- snakes, into: %{} do
      {pid_to_id(snake_pid), value}
    end
  end

  defp pid_to_id(pid) do
    :crypto.hash(:md5, inspect(pid))
    |> Base.encode64()
    |> String.slice(0..7)
  end
end
