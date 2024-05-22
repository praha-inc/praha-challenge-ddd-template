import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { TaskQueryService } from "../../application/query-service/task.query-service";
import { SetTaskDoneUsecase } from "../../application/usecase/set-task-done-usecase";
import { postgreSQLTaskQueryService } from "../../infrastructure/query-service/postgresql-task.query-service";
import { PostgreSQLTaskRepository } from "../../infrastructure/repository/postgresql-task.repository";

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

    const queryService = new TaskQueryService(postgreSQLTaskQueryService);
    const queryServicePayload = await queryService.execute(id);

    if (queryServicePayload.result === "not-found") {
      return c.text("task not found", 404);
    }
    if (queryServicePayload.result === "failure") {
      return c.text(queryServicePayload.error.message, 500);
    }

    const usecase = new SetTaskDoneUsecase(new PostgreSQLTaskRepository());
    const payload = await usecase.execute({
      task: {
        id: queryServicePayload.data.id,
        title: queryServicePayload.data.title,
        done: queryServicePayload.data.done,
      },
    });

    switch (payload.result) {
      case "success": {
        const { data } = payload;
        return c.json({
          id: data.getId(),
          title: data.getTitle(),
          done: data.isDone(),
        });
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
