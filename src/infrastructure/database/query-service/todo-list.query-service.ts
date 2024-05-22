import { eq } from "drizzle-orm";
import { getDatabase } from "../../../libs/drizzle/get-database";
import { tasks } from "../../../libs/drizzle/schema";
import type { TodoListQueryServiceInterface } from "../../../query-service/todo-list.query-service";

export const todoListQueryService: TodoListQueryServiceInterface = async () => {
  const database = getDatabase();

  const data = await database
    .select({
      id: tasks.id,
      title: tasks.title,
      done: tasks.done,
    })
    .from(tasks)
    .where(eq(tasks.done, false));

  return data;
};
