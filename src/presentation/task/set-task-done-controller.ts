import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { z } from "zod";
import {
  SetTaskDoneUseCase,
  SetTaskDoneUseCaseNotFoundError,
} from "../../application/use-case/set-task-done-use-case";
import { PostgresqlTaskRepository } from "../../infrastructure/repository/postgresql-task-repository";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    setTaskDoneUseCase: SetTaskDoneUseCase;
  };
};

export const setTaskDoneController = new Hono<Env>();

setTaskDoneController.post(
  "/tasks/:id/done",
  zValidator("param", z.object({ id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.text("invalid id", 400);
    }

    return;
  }),
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const taskRepository = new PostgresqlTaskRepository(database);
    const setTaskDoneUseCase = new SetTaskDoneUseCase(taskRepository);
    context.set("setTaskDoneUseCase", setTaskDoneUseCase);

    await next();
  }),
  async (context) => {
    try {
      const id = context.req.valid("param").id;

      const payload = await context.var.setTaskDoneUseCase.invoke({
        taskId: id,
      });
      return context.json(payload);
    } catch (error) {
      if (error instanceof SetTaskDoneUseCaseNotFoundError) {
        return context.text(error.message, 404);
      }

      throw error;
    }
  },
);
