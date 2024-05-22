import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { CreateTaskUsecase } from "../../application/usecase/create-task-usecase";
import { PostgreSQLTaskRepository } from "../../infrastructure/repository/postgresql-task.repository";

export const createTaskController = new Hono();

createTaskController.post(
  "/tasks/new",
  zValidator("json", z.object({ title: z.string() }), (result, c) => {
    if (!result.success) {
      return c.text("invalid title", 400);
    }

    return;
  }),
  async (c) => {
    const title = c.req.valid("json").title;

    const repository = new PostgreSQLTaskRepository();
    const usecase = new CreateTaskUsecase(repository);
    const payload = await usecase.execute(title);

    switch (payload.result) {
      case "success": {
        const { data } = payload;
        return c.json({
          id: data.getId(),
          title: data.getTitle(),
          done: data.isDone(),
        });
      }
      case "failure": {
        return c.text(payload.error.message, 500);
      }
    }
  },
);
