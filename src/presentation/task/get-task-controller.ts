import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { z } from "zod";
import type { TaskQueryServiceInterface } from "../../application/query-service/task-query-service";
import { PostgresqlTaskQueryService } from "../../infrastructure/query-service/postgresql-task-query-service";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    taskQueryService: TaskQueryServiceInterface;
  };
};

export const getTaskController = new Hono();

getTaskController.get(
  "/tasks/:id",
  zValidator("param", z.object({ id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.text("invalid id", 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const taskQueryService = new PostgresqlTaskQueryService(database);
    context.set("taskQueryService", taskQueryService);

    await next();
  }),
  async (context) => {
    const param = context.req.valid("param");

    const payload = await context.var.taskQueryService.invoke(param);
    if (!payload) {
      return context.text("task not found", 404);
    }
    return context.json(payload);
  },
);
