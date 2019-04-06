defmodule Snelixir.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    Supervisor.start_link(
      [
        Plug.Cowboy.child_spec(
          scheme: :http,
          plug: nil,
          options: [
            port: Application.get_env(:snelixir, :port, 4000),
            dispatch: dispatch()
          ]
        )
      ],
      strategy: :one_for_one,
      name: Snelixir.Application
    )
  end

  defp dispatch() do
    [
      {:_,
       [
         {"/ws", Snelixir.Ws, %{}},
         {:_, Plug.Cowboy.Handler, {Snelixir.Endpoint, []}}
       ]}
    ]
  end
end
