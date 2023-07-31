import React, { useEffect, useState } from "react";
import axios from "axios";

type Todo = {
  id: string;
  title: string;
  desc: string;
};

export default function TodolistPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
      const [checkboxStates, setCheckboxStates] = useState<{
    [id: string]: boolean;
  }>({});

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
  }, []);

  const handleRememberMeChange = (id: string) => {
    setCheckboxStates({
      ...checkboxStates,
      [id]: !checkboxStates[id],
    });
  };

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
    <div className="flex justify-center items-center h-screen">
      <div className="bg-[#fff] w-[700px] grid grid-cols-6">
        <div className="col-span-6">
          <form onSubmit={handleSubmit} className="flex gap-1">
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
        {todos.map((todo) => (
          <div key={todo.id} className="col-span-5 grid grid-cols-2 my-1">
            <div className="flex">
              <div className="form-control px-1">
                <label className="cursor-pointer label">
                  <input
                    type="checkbox"
                    checked={checkboxStates[todo.id] || false}
                    className="checkbox checkbox-success"
                    onChange={() => handleRememberMeChange(todo.id)}
                  />
                </label>
              </div>
              <span className="bg-[#ca3737]">{todo.title}: </span>
            </div>
            <div className="px-2">
              <span className="">{todo.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
