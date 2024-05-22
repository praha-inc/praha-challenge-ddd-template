import { serve } from "@hono/node-server";
import { Hono } from "hono";
import tasks from "./controller/tasks.controller";
import "dotenv/config";

const app = new Hono();

app.route("tasks", tasks);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
