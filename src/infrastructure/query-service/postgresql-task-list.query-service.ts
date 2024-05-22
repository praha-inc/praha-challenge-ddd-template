import type { TaskListQueryServiceInterface } from "../../application/query-service/task-list.query-service";
import { getDatabase } from "../../libs/drizzle/get-database";
import { tasks } from "../../libs/drizzle/schema";

export const postgreSQLTaskListQueryService: TaskListQueryServiceInterface =
  async () => {
    try {
      const database = getDatabase();

      const data = await database
        .select({
          id: tasks.id,
          title: tasks.title,
          done: tasks.done,
        })
        .from(tasks);

      return { result: "success", data };
    } catch (error) {
      return {
        result: "failure",
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
    }
  };
