import express from "express";
import { Todo } from "@repo/utils";

const app = express();
const PORT = 5000;


app.use(express.json());

let todos: Todo[] = [];
let nextId = 1;

function getAllTodos(): Todo[] {
  return todos;
}

function createTodo(text: string): Todo {
  const newTodo = { id: nextId, todo: text };
  todos.push(newTodo);
  nextId++;
  return newTodo;
}

function getTodoById(id: number): Todo | undefined {
  return todos.find(t => t.id === id);
}

function updateTodo(id: number, text: string): Todo | undefined {
  const todo = todos.find(t => t.id === id);
  if (!todo) return undefined;
  todo.todo = text;
  return todo;
}

function deleteTodo(id: number): boolean {
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



//When someone wants to add a new task, it'll create a new task with the provided description and add it to the list
app.post("/todos", (req, res) => {
  const newTodo = createTodo(req.body.todo);
  res.status(201).json(newTodo);
});


//When someone asks for a specific task by its number, it'll find it in the list and show it 
app.get("/todos/:id", (req, res) => {
  const todo = getTodoById(Number(req.params.id));
  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }
  res.json(todo);
});


//When someone wants to change a task, it'll find it by its number and update the task description
app.put("/todos/:id", (req, res) => {
  const todo = updateTodo(Number(req.params.id), req.body.todo);
  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }
  res.json(todo);
});

//When someone wants to remove a task, it'll find it by its number and delete it from the list
app.delete("/todos/:id", (req, res) => {
  const deleted = deleteTodo(Number(req.params.id));
  if (!deleted) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }
    res.status(204).send();
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});