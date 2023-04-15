import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const DataPath = path.join(process.cwd(), "data", "todos.json");

async function getTodos() {
  const todos = await fs.promises.readFile(DataPath, "utf-8");
  return JSON.parse(todos);
}

async function addTodo(item: any) {
  try {
    const todos = await getTodos();
    const lastId = todos.length > 0 ? todos[todos.length - 1].id : 0;
    const newTodo = { 
      ...item, 
      id: lastId + 1
    };
    todos.push(newTodo);
    await fs.promises.writeFile(DataPath, JSON.stringify(todos));
    return newTodo;
  } catch (error) {
    throw new Error("Failed to add todo.");
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const items = await getTodos();
      res.status(200).json(items);
      break;
    case "POST":
      const { context } = req.body;
      const newTodo = {
        context,
        isStatus: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(), 
      };
      const createdTodo = await addTodo(newTodo);
      res.status(201).json(createdTodo);
      break;
    default:
      res.status(405).end("Method Not Allowed");
      break;
  }
}
