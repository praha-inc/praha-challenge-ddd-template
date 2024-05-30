import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { CreateTaskUsecase } from "../../application/usecase/create-task-usecase";
import { PostgresqlTaskRepository } from "../../infrastructure/repository/postgresql-task-repository";

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

    const repository = new PostgresqlTaskRepository();
    const usecase = new CreateTaskUsecase(repository);
    const payload = await usecase.execute(title);

    switch (payload.result) {
      case "success": {
        return c.json(payload.data);
      }
      case "failure": {
        return c.text(payload.error.message, 500);
      }
    }
  },
);
