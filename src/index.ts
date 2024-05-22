import { serve } from "@hono/node-server";
import { Hono } from "hono";
import sample from "./controller/sample.controller";
import tasks from "./controller/tasks.controller";
import "dotenv/config";

const app = new Hono();

app.route("sample", sample);
app.route("tasks", tasks);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
