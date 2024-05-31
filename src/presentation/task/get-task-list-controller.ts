import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { TaskListQueryServiceInterface } from "../../application/query-service/task-list-query-service";
import type { TodoListQueryServiceInterface } from "../../application/query-service/todo-list-query-service";
import { PostgresqlTaskListQueryService } from "../../infrastructure/query-service/postgresql-task-list-query-service";
import { PostgresqlTodoListQueryService } from "../../infrastructure/query-service/postgresql-todo-list-query-service";

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
  async (context) => {
    const filter = context.req.valid("query").filter;

    const queryService:
      | TaskListQueryServiceInterface
      | TodoListQueryServiceInterface =
      filter === "todo"
        ? new PostgresqlTodoListQueryService()
        : new PostgresqlTaskListQueryService();

    const payload = await queryService.invoke();
    return context.json(payload);
  },
);
