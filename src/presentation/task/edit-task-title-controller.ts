import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { TaskQueryService } from "../../application/query-service/task-query-service";
import { EditTaskTitleUsecase } from "../../application/usecase/edit-task-title-usecase";
import { postgresqlTaskQueryService } from "../../infrastructure/query-service/postgresql-task-query-service";
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
  async (c) => {
    const id = c.req.valid("param").id;
    const title = c.req.valid("json").title;

    const queryService = new TaskQueryService(postgresqlTaskQueryService);
    const queryServicePayload = await queryService.execute(id);

    if (queryServicePayload.result === "not-found") {
      return c.text("task not found", 404);
    }
    if (queryServicePayload.result === "failure") {
      return c.text(queryServicePayload.error.message, 500);
    }

    const usecase = new EditTaskTitleUsecase(new PostgresqlTaskRepository());
    const usecasePayload = await usecase.execute({
      task: {
        id: queryServicePayload.data.id,
        title: queryServicePayload.data.title,
        done: queryServicePayload.data.done,
      },
      title,
    });

    switch (usecasePayload.result) {
      case "success": {
        const { data } = usecasePayload;
        return c.json(data);
      }
      case "not-found": {
        return c.text("task not found", 404);
      }
      case "failure": {
        return c.text(usecasePayload.error.message, 500);
      }
    }
  },
);
