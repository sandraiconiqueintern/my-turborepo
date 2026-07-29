import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:5000";

const server = new McpServer({
  name: "todos-mcp-server",
  version: "0.0.0",
});

server.registerTool(
  "get_todos",
  {
    title: "Get todos",
    description: "Fetch the current list of todo items.",
    inputSchema: {},
  },
  async () => {
    const response = await fetch(`${API_BASE_URL}/todos`);
    const todos = await response.json();
    return {
      content: [{ type: "text", text: JSON.stringify(todos, null, 2) }],
    };
  }
);

server.registerTool(
  "add_todo",
  {
    title: "Add todo",
    description: "Add a new todo item with the given title.",
    inputSchema: {
      title: z.string().describe("The title of the todo to add"),
    },
  },
  async ({ title }) => {
    const fakeNewTodo = {
      id: Math.random().toString(36).slice(2, 7),
      title,
      done: false,
    };
    return {
      content: [
        { type: "text", text: JSON.stringify(fakeNewTodo, null, 2) },
      ],
    };
  }
);

server.registerTool(
  "complete_todo",
  {
    title: "Complete todo",
    description: "Mark a todo item as done, given its id.",
    inputSchema: {
      id: z.string().describe("The id of the todo to mark as done"),
    },
  },
  async ({ id }) => {
    const fakeCompletedTodo = { id, done: true };
    return {
      content: [
        { type: "text", text: JSON.stringify(fakeCompletedTodo, null, 2) },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Todos MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error starting MCP server:", error);
  process.exit(1);
});
