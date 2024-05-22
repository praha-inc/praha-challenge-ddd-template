import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { taskListQueryService } from "../infrastructure/database/query-service/task-list.query-service";
import { taskQueryService } from "../infrastructure/database/query-service/task.query-service";
import { todoListQueryService } from "../infrastructure/database/query-service/todo-list.query-service";
import { TaskRepository } from "../infrastructure/database/repository/task.repository";
import { CreateTaskUsecase } from "../usecase/create-task-usecase";
import { EditTaskTitleUsecase } from "../usecase/edit-task-title-usecase";
import { GetTaskByIdUsecase } from "../usecase/get-task-by-id.usecase";
import { GetTaskListUsecase } from "../usecase/get-task-list.usecase";
import { GetTodoListUsecase } from "../usecase/get-todo-list.usecase";
import { SetTaskDoneUsecase } from "../usecase/set-task-done-usecase";

const app = new Hono();

app.get(
  "/",
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

    const usecase =
      filter === "todo"
        ? new GetTodoListUsecase(todoListQueryService)
        : new GetTaskListUsecase(taskListQueryService);
    const payload = await usecase.execute();

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

app.get(
  "/:id",
  zValidator("param", z.object({ id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.text("invalid id", 400);
    }

    return;
  }),
  async (c) => {
    const id = c.req.valid("param").id;

    const usecase = new GetTaskByIdUsecase(taskQueryService);
    const payload = await usecase.execute(id);

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

app.post(
  "/new",
  zValidator("json", z.object({ title: z.string() }), (result, c) => {
    if (!result.success) {
      return c.text("invalid title", 400);
    }

    return;
  }),
  async (c) => {
    const title = c.req.valid("json").title;

    const repository = new TaskRepository();
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

app.post(
  "/:id/done",
  zValidator("param", z.object({ id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.text("invalid id", 400);
    }

    return;
  }),
  async (c) => {
    const id = c.req.valid("param").id;

    const repository = new TaskRepository();
    const usecase = new SetTaskDoneUsecase(repository, taskQueryService);
    const payload = await usecase.execute(id);

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

app.post(
  "/:id/edit",
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

    const repository = new TaskRepository();
    const usecase = new EditTaskTitleUsecase(repository, taskQueryService);
    const payload = await usecase.execute({ id, title });

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

export default app;
