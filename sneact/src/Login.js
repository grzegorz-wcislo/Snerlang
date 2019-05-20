import React, { useState, useContext } from "react";
import { GameContext } from "./Game";

export default ({ name: initialName }) => {
  const [name, setName] = useState(initialName);

  const { login } = useContext(GameContext);

  const handleNameChange = e => {
    setName(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    login(name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <input type="submit" value="Start" />
    </form>
  );
};
