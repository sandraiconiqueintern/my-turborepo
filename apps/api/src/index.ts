import express from "express";
import { Todo } from "@repo/utils";

const app = express();
const PORT = 5000;

app.use(express.json());

let todos: Todo[] = [];

function generateCustomId(length: number = 5): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

function getAllTodos(): Todo[] {
  return todos;
}

function createTodo(text: string): Todo {
  const newTodo = { 
    id: generateCustomId(), 
    todo: text 
  };
  todos.push(newTodo);
  return newTodo;
}

function getTodoById(id: string): Todo | undefined {
  return todos.find(t => t.id === id);
}

function updateTodo(id: string, text: string): Todo | undefined {
  const todo = todos.find(t => t.id === id);
  if (!todo) return undefined;
  todo.todo = text;
  return todo;
}

function deleteTodo(id: string): boolean {
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}

app.get("/", (req, res) => {
  res.send("Hellaur!");
});

app.get("/todos", (req, res) => {
  res.json(getAllTodos());
});

app.post("/todos", (req, res) => {
  const newTodo = createTodo(req.body.todo);
  res.status(201).json(newTodo);
});

app.get("/todos/:id", (req, res) => {
  const todo = getTodoById(req.params.id);
  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }
  res.json(todo);
});

app.put("/todos/:id", (req, res) => {
  const todo = updateTodo(req.params.id, req.body.todo);
  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }
  res.json(todo);
});

app.delete("/todos/:id", (req, res) => {
  const deleted = deleteTodo(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});