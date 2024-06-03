import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
  EditTaskTitleUseCase,
  EditTaskTitleUseCaseNotFoundError,
} from "../../application/use-case/edit-task-title-use-case";
import { PostgresqlTaskRepository } from "../../infrastructure/repository/postgresql-task-repository";
import { getDatabase } from "../../libs/drizzle/get-database";

export const editTaskTitleController = new Hono();

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
  async (context) => {
    try {
      const id = context.req.valid("param").id;
      const title = context.req.valid("json").title;

      const database = getDatabase();
      const taskRepository = new PostgresqlTaskRepository(database);
      const useCase = new EditTaskTitleUseCase(taskRepository);

      const payload = await useCase.invoke({ taskId: id, title });
      return context.json(payload);
    } catch (error) {
      if (error instanceof EditTaskTitleUseCaseNotFoundError) {
        return context.text(error.message, 404);
      }

      throw error;
    }
  },
);
