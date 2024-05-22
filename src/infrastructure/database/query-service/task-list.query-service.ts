import { getDatabase } from "../../../libs/drizzle/get-database";
import { tasks } from "../../../libs/drizzle/schema";
import type { TaskListQueryServiceInterface } from "../../../query-service/task-list.query-service";

export const taskListQueryService: TaskListQueryServiceInterface = async () => {
  const database = getDatabase();

  const data = await database
    .select({
      id: tasks.id,
      title: tasks.title,
      done: tasks.done,
    })
    .from(tasks);

  return data;
};
