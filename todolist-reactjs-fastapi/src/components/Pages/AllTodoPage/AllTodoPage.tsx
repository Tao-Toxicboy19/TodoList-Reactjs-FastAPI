import { useContext, useEffect } from "react";
import { TodoContext } from "../../../App";
import axios from "axios";
import DeleteTodo from "../DeleteTodo/DeleteTodo";

type Props = {};

export default function AllTodoPage({}: Props) {
  const { todos, setTodos } = useContext(TodoContext);

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

  const handleDeleteTodo = (id: string) => {
    // Remove the deleted Todo from the state
    setTodos(todos.filter((todo: any) => todo.id !== id));
  };

  return (
    <div>
      {todos.map((todo: any) => (
        <div key={todo.id} className="col-span-5 grid grid-cols-2 my-2">
          <div className="flex">
            <div className="form-control px-1">
              <label className="cursor-pointer label">
                <input type="checkbox" className="checkbox checkbox-success" />
              </label>
            </div>
            <span className="bg-[#ca3737]">{todo.title}: </span>
          </div>
          <div className="px-2">
            <span className="">{todo.desc}</span>
          </div>
          <DeleteTodo id={todo.id} onDeleteTodo={handleDeleteTodo} />{" "}
        </div>
      ))}
    </div>
  );
}
