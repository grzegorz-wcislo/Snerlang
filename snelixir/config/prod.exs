use Mix.Config

config :snelixir,
  port: System.get_env("PORT") |> String.to_integer()
