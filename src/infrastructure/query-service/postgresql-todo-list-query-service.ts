import { eq } from "drizzle-orm";
import type {
  TodoListQueryServiceInterface,
  TodoListQueryServicePayload,
} from "../../application/query-service/todo-list-query-service";
import type { Database } from "../../libs/drizzle/get-database";
import { tasks } from "../../libs/drizzle/schema";

export class PostgresqlTodoListQueryService
  implements TodoListQueryServiceInterface
{
  public constructor(private readonly database: Database) {}

  public async invoke(): Promise<TodoListQueryServicePayload> {
    return this.database
      .select({
        id: tasks.id,
        title: tasks.title,
        done: tasks.done,
      })
      .from(tasks)
      .where(eq(tasks.done, false));
  }
}
