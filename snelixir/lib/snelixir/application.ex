defmodule Snelixir.Application do
  @moduledoc false

  use Application

  def start(_type, _args) do
    Supervisor.start_link(
      [
        Plug.Cowboy.child_spec(
          scheme: :http,
          plug: nil,
          options: [
            port: Application.get_env(:snelixir, :port, 4000),
            dispatch: dispatch()
          ]
        ),
        Snelixir.Lobby
      ],
      strategy: :one_for_one,
      name: Snelixir.Application
    )
  end

  defp dispatch() do
    [{:_, [{"/", Snelixir.Ws, :init}]}]
  end
end
