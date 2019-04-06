use Mix.Config

config :snelixir,
  port: 4001

import_config "#{Mix.env()}.exs"
