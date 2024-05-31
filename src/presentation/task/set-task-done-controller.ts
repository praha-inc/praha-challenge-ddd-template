import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { TaskQueryServiceInterface } from "../../application/query-service/task-query-service";
import { SetTaskDoneUseCase } from "../../application/use-case/set-task-done-use-case";
import { PostgresqlTaskQueryService } from "../../infrastructure/query-service/postgresql-task-query-service";
import { PostgresqlTaskRepository } from "../../infrastructure/repository/postgresql-task-repository";

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
    const id = context.req.valid("param").id;

    const queryService: TaskQueryServiceInterface =
      new PostgresqlTaskQueryService();
    const task = await queryService.invoke({ id });

    if (!task) {
      return context.text("task not found", 404);
    }

    const useCase = new SetTaskDoneUseCase(new PostgresqlTaskRepository());
    const payload = await useCase.execute({ task });
    return context.json(payload);
  },
);
