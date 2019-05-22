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
    Process.link(snake)
    Snelixir.Ws.message(snake, "Hello")
    IO.puts "Added #{inspect(snake)}"
    newSnakes = Map.put(snakes, snake, name)
    if map_size(newSnakes) == 2 do
      Snelixir.Game.start(newSnakes)
      {:reply, :ok, %{}}
    else
      {:reply, :ok, newSnakes}
    end

  end

  def handle_info({:EXIT, snake, _reason}, snakes) do
    IO.puts "EXITED and removed #{inspect(snake)}"
    {:noreply, Map.delete(snakes, snake)}
  end
end
