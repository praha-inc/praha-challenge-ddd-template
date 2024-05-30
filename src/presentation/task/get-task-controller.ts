import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { TaskQueryService } from "../../application/query-service/task-query-service";
import { postgresqlTaskQueryService } from "../../infrastructure/query-service/postgresql-task-query-service";

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

    const queryService = new TaskQueryService(postgresqlTaskQueryService);
    const payload = await queryService.execute(id);

    switch (payload.result) {
      case "success": {
        const { data } = payload;
        return c.json(data);
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
