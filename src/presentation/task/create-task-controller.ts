import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { z } from "zod";
import { CreateTaskUseCase } from "../../application/use-case/create-task-use-case";
import { PostgresqlTaskRepository } from "../../infrastructure/repository/postgresql-task-repository";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    createTaskUseCase: CreateTaskUseCase;
  };
};

export const createTaskController = new Hono<Env>();

createTaskController.post(
  "/tasks/new",
  zValidator("json", z.object({ title: z.string() }), (result, c) => {
    if (!result.success) {
      return c.text("invalid title", 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const taskRepository = new PostgresqlTaskRepository(database);
    const createTaskUseCase = new CreateTaskUseCase(taskRepository);
    context.set("createTaskUseCase", createTaskUseCase);

    await next();
  }),
  async (context) => {
    const body = context.req.valid("json");

    const payload = await context.var.createTaskUseCase.invoke(body);
    return context.json(payload);
  },
);
