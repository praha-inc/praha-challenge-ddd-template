import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
  SetTaskDoneUseCase,
  SetTaskDoneUseCaseNotFoundError,
} from "../../application/use-case/set-task-done-use-case";
import { PostgresqlTaskRepository } from "../../infrastructure/repository/postgresql-task-repository";
import { getDatabase } from "../../libs/drizzle/get-database";

export const setTaskDoneController = new Hono();

setTaskDoneController.post(
  "/tasks/:id/done",
  zValidator("param", z.object({ id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.text("invalid id", 400);
    }

    return;
  }),
  async (context) => {
    try {
      const id = context.req.valid("param").id;

      const database = getDatabase();
      const repository = new PostgresqlTaskRepository(database);
      const useCase = new SetTaskDoneUseCase(repository);

      const payload = await useCase.invoke({ taskId: id });
      return context.json(payload);
    } catch (error) {
      if (error instanceof SetTaskDoneUseCaseNotFoundError) {
        return context.text(error.message, 404);
      }

      throw error;
    }
  },
);
