import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { z } from "zod";
import {
  EditTaskTitleUseCase,
  EditTaskTitleUseCaseNotFoundError,
} from "../../application/use-case/edit-task-title-use-case";
import { PostgresqlTaskRepository } from "../../infrastructure/repository/postgresql-task-repository";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    editTaskTitleUseCase: EditTaskTitleUseCase;
  };
};

export const editTaskTitleController = new Hono<Env>();

editTaskTitleController.post(
  "/tasks/:id/edit",
  zValidator("param", z.object({ id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.text("invalid id", 400);
    }

    return;
  }),
  zValidator("json", z.object({ title: z.string() }), (result, c) => {
    if (!result.success) {
      return c.text("invalid body", 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const taskRepository = new PostgresqlTaskRepository(database);
    const editTaskTitleUseCase = new EditTaskTitleUseCase(taskRepository);
    context.set("editTaskTitleUseCase", editTaskTitleUseCase);

    await next();
  }),
  async (context) => {
    try {
      const param = context.req.valid("param");
      const body = context.req.valid("json");

      const payload = await context.var.editTaskTitleUseCase.invoke({
        taskId: param.id,
        title: body.title,
      });
      return context.json(payload);
    } catch (error) {
      if (error instanceof EditTaskTitleUseCaseNotFoundError) {
        return context.text(error.message, 404);
      }

      throw error;
    }
  },
);
