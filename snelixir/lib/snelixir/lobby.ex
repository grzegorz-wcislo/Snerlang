defmodule Snelixir.Lobby do
  use GenServer

  ## Client API

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, :ok, name: :lobby)
  end

  def add do
    GenServer.call(:lobby, :add)
  end

  ## Server Callbacks

  def init(:ok) do
    Process.flag(:trap_exit, true)
    {:ok, MapSet.new}
  end

  def handle_call(:add, {snake, _ref}, snakes) do
    Process.link(snake)
    Snelixir.Ws.message(snake, "Hello")
    IO.puts "Added #{inspect(snake)}"
    {:reply, :ok, MapSet.put(snakes, snake)}
  end

  def handle_info({:EXIT, snake, _reason}, snakes) do
    IO.puts "EXITED and removed #{inspect(snake)}"
    {:noreply, MapSet.delete(snakes, snake)}
  end
end
