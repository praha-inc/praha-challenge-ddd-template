import { eq } from "drizzle-orm";
import type {
  TodoListQueryServiceInterface,
  TodoListQueryServicePayload,
} from "../../application/query-service/todo-list-query-service";
import { getDatabase } from "../../libs/drizzle/get-database";
import { tasks } from "../../libs/drizzle/schema";

export class PostgresqlTodoListQueryService
  implements TodoListQueryServiceInterface
{
  public async invoke(): Promise<TodoListQueryServicePayload> {
    return getDatabase()
      .select({
        id: tasks.id,
        title: tasks.title,
        done: tasks.done,
      })
      .from(tasks)
      .where(eq(tasks.done, false));
  }
}
