defmodule Snelixir.EndpointTest do
  use ExUnit.Case, async: true
  use Plug.Test

  @opts Snelixir.Endpoint.init([])

  test "returns pong" do
    # Create a test connection
    conn = conn(:get, "/ping")

    # Invoke the plug
    conn = Snelixir.Endpoint.call(conn, @opts)

    # Assert the response and status
    assert conn.state == :sent
    assert conn.status == 200
    assert conn.resp_body == "pong"
  end
end
