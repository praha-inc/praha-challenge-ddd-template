import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { z } from "zod";
import type { TaskListQueryServiceInterface } from "../../application/query-service/task-list-query-service";
import type { TodoListQueryServiceInterface } from "../../application/query-service/todo-list-query-service";
import { PostgresqlTaskListQueryService } from "../../infrastructure/query-service/postgresql-task-list-query-service";
import { PostgresqlTodoListQueryService } from "../../infrastructure/query-service/postgresql-todo-list-query-service";
import { getDatabase } from "../../libs/drizzle/get-database";

type Env = {
  Variables: {
    taskListQueryService: TaskListQueryServiceInterface;
    todoListQueryService: TodoListQueryServiceInterface;
  };
};

export const getTaskListController = new Hono<Env>();

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
  createMiddleware<Env>(async (context, next) => {
    const database = getDatabase();
    const taskListQueryService = new PostgresqlTaskListQueryService(database);
    const todoListQueryService = new PostgresqlTodoListQueryService(database);
    context.set("taskListQueryService", taskListQueryService);
    context.set("todoListQueryService", todoListQueryService);

    await next();
  }),
  async (context) => {
    const query = context.req.valid("query");

    if (query.filter === "todo") {
      const payload = await context.var.todoListQueryService.invoke();
      return context.json(payload);
    }

    const payload = await context.var.taskListQueryService.invoke();
    return context.json(payload);
  },
);
