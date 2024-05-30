import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { TaskQueryServiceInterface } from "../../application/query-service/task-query-service";
import { PostgresqlTaskQueryService } from "../../infrastructure/query-service/postgresql-task-query-service";

export const getTaskController = new Hono();

getTaskController.get(
  "/tasks/:id",
  zValidator("param", z.object({ id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.text("invalid id", 400);
    }

    return;
  }),
  async (c) => {
    const id = c.req.valid("param").id;

    const queryService: TaskQueryServiceInterface =
      new PostgresqlTaskQueryService();
    const payload = await queryService.invoke(id);

    switch (payload.result) {
      case "success": {
        return c.json(payload.data);
      }
      case "not-found": {
        return c.text("task not found", 404);
      }
      case "failure": {
        return c.text(payload.error.message, 500);
      }
    }
  },
);
