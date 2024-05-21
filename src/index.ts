import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { ulid } from "ulid";
import { getDatabase } from "./libs/drizzle/get-database";
import { someData } from "./libs/drizzle/schema";
import "dotenv/config";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/sample", async (c) => {
  const database = getDatabase();
  const data = await database.select().from(someData);

  return c.text(`sample data count: ${data.length}`);
});

app.post("/sample", async (c) => {
  const database = getDatabase();
  const { required, number } = await c.req.json<{
    required: boolean;
    number: number;
  }>();
  const id = ulid();
  await database.insert(someData).values({ id, required, number });

  return c.text("sample data inserted");
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
