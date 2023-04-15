import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const DataPath = path.join(process.cwd(), "data", "todos.json");

async function getCurrentTimestamp() {
  return new Date().toISOString();
}

async function getTodos() {
  const todos = await fs.promises.readFile(DataPath, "utf-8");
  return JSON.parse(todos);
}

async function updateTodo(id: number, item: any) {
  try {
    const todos = await getTodos();
    const todoToUpdateIndex = todos.findIndex((todo: any) => todo.id === id);
    if (todoToUpdateIndex === -1) {
      throw new Error("Todo not found.");
    }
    const todoToUpdate = todos[todoToUpdateIndex];
    const updatedTodo = {
      ...todoToUpdate,
      ...item,
      id,
      updated_at: await getCurrentTimestamp()
    };
    todos[todoToUpdateIndex] = updatedTodo;
    await fs.promises.writeFile(DataPath, JSON.stringify(todos));
    return updatedTodo;
  } catch (error) {
    throw new Error("Failed to update todo.");
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "PUT":
      try {
        const { context, isStatus } = req.body;
        const updatedTodo = await updateTodo(Number(id), {
          context,
          isStatus,
        });
        res.status(200).json(updatedTodo);
      } catch (error) {
        res.status(500).json({ error: "Failed to update todo." });
      }
      break;
    case "DELETE":
      try {
        const todos = await getTodos();
        const updatedTodos = todos.filter(
          (todo: { id: number }) => todo.id !== Number(id)
        );

        await fs.promises.writeFile(DataPath, JSON.stringify(updatedTodos));
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete todo." });
      }
      break;
    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).json({ error: `Method ${method} not allowed.` });
      break;
  }
}
