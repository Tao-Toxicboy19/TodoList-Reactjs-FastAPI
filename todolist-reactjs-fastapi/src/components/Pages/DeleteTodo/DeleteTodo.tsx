import axios from "axios";

type Props = {
  id: string;
  onDeleteTodo: (id: string) => void; // เพิ่ม prop สำหรับการลบ Todo ใน AllTodoPage
};

export default function DeleteTodo({ id, onDeleteTodo }: Props) {
  const handleDelete = () => {
    // Send a DELETE request to the API to delete the Todo
    axios
      .delete(`http://127.0.0.1:8000/delete/${id}`)
      .then((response) => {
        console.log("Todo deleted:", response.data);
        // เมื่อลบ Todo สำเร็จให้เรียกใช้ callback function ที่ได้รับมาจาก AllTodoPage
        onDeleteTodo(id);
      })
      .catch((error) => {
        console.error("Error deleting Todo:", error);
      });
  };

  return (
    <div className="tooltip" data-tip="Delete">
      <button className="btn" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}
