import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { TaskListQueryService } from "../../application/query-service/task-list-query-service";
import { TodoListQueryService } from "../../application/query-service/todo-list-query-service";
import { postgresqlTaskListQueryService } from "../../infrastructure/query-service/postgresql-task-list-query-service";
import { postgresqlTodoListQueryService } from "../../infrastructure/query-service/postgresql-todo-list-query-service";

export const getTaskListController = new Hono();

getTaskListController.get(
  "/tasks",
  zValidator(
    "query",
    z.object({ filter: z.string().optional() }),
    (result, c) => {
      if (!result.success) {
        return c.text("invalid query", 400);
      }

      return;
    },
  ),
  async (c) => {
    const filter = c.req.valid("query").filter;

    const queryService =
      filter === "todo"
        ? new TodoListQueryService(postgresqlTodoListQueryService)
        : new TaskListQueryService(postgresqlTaskListQueryService);
    const payload = await queryService.execute();

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
