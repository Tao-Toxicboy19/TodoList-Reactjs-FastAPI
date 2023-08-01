import React, { useContext, useState } from "react";
import axios from "axios";
import { Todo } from "../../../types/Todo.type";
import { TodoContext } from "../../../App";

export default function TodolistPage() {
  const { todos, setTodos } = useContext(TodoContext);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Create a new Todo object with the input values
    const newTodo: Todo = {
      id: Math.random().toString(), // You should use a proper ID generator in a real app
      title: title,
      desc: desc,
    };

    // Send the newTodo data to the server using axios.post
    axios
      .post("http://127.0.0.1:8000/create", newTodo)
      .then((response) => {
        // Handle the response as needed (e.g., show success message)
        console.log("New Todo created:", response.data);
        // Update the state with the new Todo
        setTodos([...todos, newTodo]);
        // Clear the input fields after submitting
        setTitle("");
        setDesc("");
      })
      .catch((error) => {
        console.error("Error creating new Todo:", error);
      });
  };

  return (
    <div className="">
      <div className="">
        <div className="">
          <form onSubmit={handleSubmit} className="">
            <input
              type="text"
              placeholder="title"
              className="input input-bordered w-full max-w-xs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="desc"
              className="input input-bordered w-full max-w-xs"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Create Todo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
