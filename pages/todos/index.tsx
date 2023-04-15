import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TodoTable from "../components/TodoTable";
import TodoForm from "../components/TodoForm";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";

interface Todo {
  id: any;
  context: string;
  isStatus: boolean;
  created_at: string;
  updated_at: string;
}

const Todo = () => {
  const [formData, setFormData] = useState({
    id: "",
    context: "",
    isStatus: false,
  });

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch("/api/todos");
      const data = await response.json();
      if (response.ok) {
        setTodos(data);
      } else {
        console.error("Failed to fetch items:", data);
      }
    };

    fetchItems();
  }, []);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isEditing) {
      // Update existing todo
      const response = await fetch(`/api/todos/${formData.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Item updated:", data);
        toast.success("Todo updated");
        setFormData({ id: "", context: "", isStatus: false });
        setIsEditing(false);
        const response = await fetch("/api/todos");
        const updatedData = await response.json();
        if (response.ok) {
          setTodos(updatedData);
        } else {
          console.error("Failed to fetch updated items:", updatedData);
        }
        router.push("/todos");
      } else {
        console.error("Failed to update item:", data);
      }
    } else {
      // Create new todo
      const response = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Item created:", data);
        toast.success("Todo created");
        setFormData({ id: "", context: "", isStatus: false });
        setIsEditing(false);
        const response = await fetch("/api/todos");
        const updatedData = await response.json();
        if (response.ok) {
          setTodos(updatedData);
        } else {
          console.error("Failed to fetch updated items:", updatedData);
        }
        router.push("/todos");
      } else {
        console.error("Failed to create item:", data);
      }
    }
  };

  const handleUpdateStatus = async (id: any) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);

    if (todoToUpdate) {
      const updatedFormData = {
        id: todoToUpdate.id,
        context: todoToUpdate.context,
        isStatus: !todoToUpdate.isStatus,
      };
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedFormData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Item updated:", data);
        toast.success("Todo has been change status");
        setFormData({ id: "", context: "", isStatus: false });
        setIsEditing(false);
        const response = await fetch("/api/todos");
        const updatedData = await response.json();
        if (response.ok) {
          setTodos(updatedData);
        } else {
          console.error("Failed to fetch updated items:", updatedData);
        }
        router.push("/todos");
      } else {
        console.error("Failed to update item:", data);
      }
    } else {
      console.error(`Todo item with ID ${id} not found.`);
    }
  };

  const handleEdit = (todo: Todo) => {
    setFormData({
      id: todo.id,
      context: todo.context,
      isStatus: todo.isStatus,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: any) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      toast.success("Todo deleted");
      setTodos((prevItems) => prevItems.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div className="h-screen max-w-7xl mx-auto flex flex-col gap-4 justify-center items-center">
      <Toaster />
      <h1 className="text-2xl self-start font-semibold">Todo</h1>
      <TodoForm
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        isEditing={isEditing}
      />

      <TodoTable
        todos={todos}
        handleUpdateStatus={handleUpdateStatus}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default Todo;
