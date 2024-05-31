import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { TaskQueryServiceInterface } from "../../application/query-service/task-query-service";
import { EditTaskTitleUseCase } from "../../application/use-case/edit-task-title-use-case";
import { PostgresqlTaskQueryService } from "../../infrastructure/query-service/postgresql-task-query-service";
import { PostgresqlTaskRepository } from "../../infrastructure/repository/postgresql-task-repository";

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
    const id = context.req.valid("param").id;
    const title = context.req.valid("json").title;

    const queryService: TaskQueryServiceInterface =
      new PostgresqlTaskQueryService();
    const task = await queryService.invoke({ id });

    if (!task) {
      return context.text("task not found", 404);
    }

    const useCase = new EditTaskTitleUseCase(new PostgresqlTaskRepository());
    const payload = await useCase.invoke({ task, title });
    return context.json(payload);
  },
);
