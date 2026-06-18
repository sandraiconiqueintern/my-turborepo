import express from "express";
import { sharedUtil } from "@repo/utils";

sharedUtil();

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Hello World from shared utils!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});