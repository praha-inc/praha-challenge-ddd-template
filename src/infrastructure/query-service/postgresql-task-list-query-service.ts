import type {
  TaskListQueryServiceInterface,
  TaskListQueryServicePayload,
} from "../../application/query-service/task-list-query-service";
import type { Database } from "../../libs/drizzle/get-database";
import { tasks } from "../../libs/drizzle/schema";

export class PostgresqlTaskListQueryService
  implements TaskListQueryServiceInterface
{
  public constructor(private readonly database: Database) {}

  public async invoke(): Promise<TaskListQueryServicePayload> {
    return this.database
      .select({
        id: tasks.id,
        title: tasks.title,
        done: tasks.done,
      })
      .from(tasks);
  }
}
