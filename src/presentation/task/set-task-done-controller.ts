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
  async (c) => {
    const id = c.req.valid("param").id;

    const queryService: TaskQueryServiceInterface =
      new PostgresqlTaskQueryService();
    const queryServicePayload = await queryService.invoke(id);

    if (queryServicePayload.result === "not-found") {
      return c.text("task not found", 404);
    }
    if (queryServicePayload.result === "failure") {
      return c.text(queryServicePayload.error.message, 500);
    }

    const useCase = new SetTaskDoneUseCase(new PostgresqlTaskRepository());
    const payload = await useCase.execute({
      task: {
        id: queryServicePayload.data.id,
        title: queryServicePayload.data.title,
        done: queryServicePayload.data.done,
      },
    });

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
