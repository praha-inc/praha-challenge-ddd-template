import { eq } from "drizzle-orm";
import type { TodoListQueryServiceInterface } from "../../application/query-service/todo-list-query-service";
import { getDatabase } from "../../libs/drizzle/get-database";
import { tasks } from "../../libs/drizzle/schema";

export const postgresqlTodoListQueryService: TodoListQueryServiceInterface =
  async () => {
    try {
      const database = getDatabase();

      const data = await database
        .select({
          id: tasks.id,
          title: tasks.title,
          done: tasks.done,
        })
        .from(tasks)
        .where(eq(tasks.done, false));

      return { result: "success", data };
    } catch (error) {
      return {
        result: "failure",
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
    }
  };
