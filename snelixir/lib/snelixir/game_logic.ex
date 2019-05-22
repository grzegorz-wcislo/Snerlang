defmodule Snelixir.GameLogic do

  def init_board(snakes) do
    # snakes - list of pids
    apples = []
    starting_positions = [[{3,3},{3,2},{3,1}],[{3,20},{4,20},{5,20}]]#,[{20,20},{20,19}],[{20,3},{21,3}]]  #[head body body tail]
    newSnakes = Enum.zip(snakes, starting_positions)
    snakes_positions = for {snakeId, position} <- newSnakes, into: %{} do
      {snakeId, position}
    end
    snakes_directions = for snake <- snakes, into: %{} do
      {snake, :front}
    end
    # return -> initial state
    tab = [1,2,3]
    List.last(tab) |> IO.inspect(label: "last")
    tab = List.delete(tab, List.last(tab))
    tab |>IO.inspect(label: "after delete")
    tab = [0|tab]
    tab |>IO.inspect(label: "after adding")
    {snakes_positions, snakes_directions, apples} #snakes -> %{}
  end

  def move_snakes(board) do
    length = 23
    {snakes_positions, snakes_directions, apples} = board
    # move snakes
    updated_snakes_positions = for snek <- snakes_positions, into: %{} do
      {id, body} = snek
      [head, neck | tail] = body
      direction = Map.get(snakes_directions, id)
      id |> IO.inspect(label: "id")
      head |> IO.inspect(label: "head")
      neck |> IO.inspect(label: "neck")
      {x1, y1} = head
      {x2, y2} = neck
      dx = case x1-x2 do
        d when d > 1 -> d - length
        d when d < -1 -> d + length
        d -> d
      end
      dy = case y1-y2 do
        dy when dy > 1 -> dy - length
        dy when dy < -1 -> dy + length
        dy -> dy
      end
      dx |> IO.inspect(label: "dx")
      dy |> IO.inspect(label: "dy")
      body |> IO.inspect(label: "body before direction")
      newHead = case direction do
        :front ->
          case {dx, dy} do
            {-1,0} -> {x1-1,y1}
            {1,0} -> {x1+1,y1}
            {0,-1} -> {x1,y1-1}
            {0,1} -> {x1,y1+1}
          end
        :right ->
          case {dx, dy} do
            {-1,0} -> {x1,y1-1}
            {1,0} -> {x1,y1+1}
            {0,-1} -> {x1+1,y1}
            {0,1} -> {x1-1,y1}
          end
        :left ->
          case {dx, dy} do
            {-1,0} -> {x1,y1+1}
            {1,0} -> {x1,y1-1}
            {0,-1} -> {x1+1,y1}
            {0,1} -> {x1-1,y1}
          end
      end

      newHead |> IO.inspect(label: "body after direction")
      {newx,newy} = newHead
      newHead = {rem(newx  + length,length), rem(newy  + length,length)}
      {id, [newHead | List.delete(body, List.last(body))]}
    end
    updated_snakes_directions = for snek <- snakes_directions, into: %{} do
      {id, direction} = snek
      direction = :front
      {id, direction}
    end

    # return -> {new state, list of pids of dead snakes}
    #{board, []}
    {updated_snakes_positions, updated_snakes_directions, apples}
  end
end
