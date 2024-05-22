import { Hono } from "hono";
import { ulid } from "ulid";
import { someDataQueryService } from "../infrastructure/database/query-service/some-data.query-service";
import { getDatabase } from "../libs/drizzle/get-database";
import { someData } from "../libs/drizzle/schema";
import { getSomeDataUsecase } from "../usecase/get-some-data.usecase";

const app = new Hono();

app.get("/", async (c) => {
  const payload = await getSomeDataUsecase(someDataQueryService);

  switch (payload.result) {
    case "success": {
      return c.json(payload.data);
    }
    case "not-found": {
      return c.text("sample data not found", 404);
    }
    case "failure": {
      return c.text("failed to get sample data", 500);
    }
  }
});

app.post("/", async (c) => {
  const database = getDatabase();
  const { required, number } = await c.req.json<{
    required: boolean;
    number: number;
  }>();
  const id = ulid();
  await database.insert(someData).values({ id, required, number });

  return c.text("sample data inserted");
});

export default app;
