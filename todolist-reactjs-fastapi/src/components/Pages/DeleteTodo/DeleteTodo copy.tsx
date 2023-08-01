import axios from "axios";
import React, { useContext } from "react";
import { TodoContext } from "../../../App";

type Todo = {
  id: string;
  title: string;
  desc: string;
};

type Props = {
  todo: Todo;
};

export default function DeleteTodo({ todo }: Props) {
  const { todos, setTodos } = useContext(TodoContext);

  const handleDeleteTodo = (id: string) => {
    // ส่ง request ไปที่ API เพื่อลบ Todo ด้วย id ที่ต้องการ
    axios
      .delete(`http://127.0.0.1:8000/delete/${id}`)
      .then((response) => {
        console.log(`xcsxx${id}`);
        // ถ้าลบสำเร็จให้อัปเดต state ของ Todos โดยเอา Todo ที่ถูกลบออก
        setTodos(todos.filter((todo: any) => todo.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting Todo:", error);
      });
  };
  //   const handleDelete = () => {
  //     onDeleteTodo(todo.id);
  //   };

  return (
    <div>
      <button onClick={handleDeleteTodo}>Delete</button>
    </div>
  );
}
