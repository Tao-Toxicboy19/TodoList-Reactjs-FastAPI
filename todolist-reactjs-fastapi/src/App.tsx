import { createContext, useState } from "react";
import CreatePage from "./components/Pages/CreatePage/CreatePage";
import { Todo } from "./types/Todo.type";
import AllTodoPage from "./components/Pages/AllTodoPage/AllTodoPage";

export const TodoContext = createContext<any>(null);

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <>
      <TodoContext.Provider value={{ todos, setTodos }}>
        <CreatePage />
        <AllTodoPage/>
      </TodoContext.Provider>
    </>
  );
}
