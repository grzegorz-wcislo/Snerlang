defmodule Snelixir.Lobby do
  use GenServer

  ## Client API

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, :ok, name: :lobby)
  end

  def add(name) do
    GenServer.call(:lobby, {:add, name})
  end

  ## Server Callbacks

  def init(:ok) do
    Process.flag(:trap_exit, true)
    {:ok, %{}}
  end

  def handle_call({:add, name}, {snake, _ref}, snakes) do
    snakes = add_snake(snakes, snake, name)

    IO.puts "Added #{inspect(snake)}"
    notify_snakes(Map.keys(snakes))

    if map_size(snakes) == 2 do
      start_game(snakes)
      {:reply, :ok, %{}}
    else
      {:reply, :ok, snakes}
    end
  end

  def handle_info({:EXIT, snake, _reason}, snakes) do
    IO.puts "EXITED and removed #{inspect(snake)}"
    notify_snakes(Map.keys(snakes))
    {:noreply, Map.delete(snakes, snake)}
  end

  ## Helper Functions

  defp add_snake(snakes, snake, name) do
    Process.link(snake)
    Map.put(snakes, snake, name)
  end

  defp notify_snakes(snakes) do
    Enum.each(snakes, fn snake -> Snelixir.Ws.lobby(snake, length(snakes)) end)
  end

  defp start_game(snakes) do
    Snelixir.Game.start(snakes)
    Map.keys(snakes)
    |> Enum.each(fn snake ->
      Process.unlink(snake)
    end)
  end
end
