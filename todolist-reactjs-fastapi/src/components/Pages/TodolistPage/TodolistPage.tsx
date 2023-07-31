import React, { useEffect, useState } from "react";
import axios from "axios";

type Props = {};

type Todo = {
  id: string;
  title: string;
  desc: string;
};

export default function TodolistPage({}: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    // Fetch data from the API
    axios
      .get("http://127.0.0.1:8000/all-todos/")
      .then((response) => {
        // Update the state with the fetched data
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array to run this effect only once on mount

  useEffect(() => {
    // Log the current value of 'todos' whenever it changes
    console.log(todos);
  }, [todos]);

  return (
    <div>
      <h1>TodolistPage</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
