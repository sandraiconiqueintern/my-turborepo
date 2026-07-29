import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const PORT = 5001;
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MCP_SERVER_ENTRY = path.resolve(
  __dirname,
  "../../mcp-server/dist/index.js"
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const mcpClient = new Client({ name: "chatbot", version: "0.0.0" });
const mcpTransport = new StdioClientTransport({
  command: "node",
  args: [MCP_SERVER_ENTRY],
});

await mcpClient.connect(mcpTransport);

const { tools: mcpTools } = await mcpClient.listTools();
console.log(
  "Connected to MCP server. Tools available:",
  mcpTools.map((t) => t.name).join(", ")
);

const openaiTools: OpenAI.Chat.Completions.ChatCompletionTool[] = mcpTools.map(
  (tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description ?? "",
      parameters: tool.inputSchema,
    },
  })
);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage: string = req.body.message;
  if (!userMessage) {
    res.status(400).json({ message: "Missing 'message' in request body" });
    return;
  }

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "user", content: userMessage },
  ];

  const firstResponse = await openai.chat.completions.create({
    model: MODEL,
    messages,
    tools: openaiTools,
  });

  const firstMessage = firstResponse.choices[0]!.message;
  messages.push(firstMessage);

  if (!firstMessage.tool_calls || firstMessage.tool_calls.length === 0) {
    res.json({ reply: firstMessage.content });
    return;
  }

  for (const toolCall of firstMessage.tool_calls) {
    if (toolCall.type !== "function") continue;

    const args = toolCall.function.arguments
      ? JSON.parse(toolCall.function.arguments)
      : {};

    const toolResult = await mcpClient.callTool({
      name: toolCall.function.name,
      arguments: args,
    });

    const resultText = Array.isArray(toolResult.content)
      ? toolResult.content
          .map((c) => (c.type === "text" ? c.text : ""))
          .join("\n")
      : JSON.stringify(toolResult);

    messages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: resultText,
    });
  }

  const secondResponse = await openai.chat.completions.create({
    model: MODEL,
    messages,
  });

  res.json({ reply: secondResponse.choices[0]!.message.content });
});

app.listen(PORT, () => {
  console.log(`Chatbot server is running on http://localhost:${PORT}`);
});
