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
    <form className="page" onSubmit={handleSubmit}>
      <label htmlFor="name">Please name your snake</label>
        <input type="text" id="name" value={name} onChange={handleNameChange} />
      <input type="submit" value="Start" />
    </form>
  );
};
