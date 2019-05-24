defmodule Snelixir.MixProject do
  use Mix.Project

  def project do
    [
      app: :snelixir,
      version: "0.1.0",
      elixir: "~> 1.8",
      build_embedded: Mix.env() == :prod,
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {Snelixir.Application, []}
    ]
  end

  defp deps do
    [
      {:plug_cowboy, "~> 2.0"},
      {:json, "~> 1.2"}
    ]
  end
end
