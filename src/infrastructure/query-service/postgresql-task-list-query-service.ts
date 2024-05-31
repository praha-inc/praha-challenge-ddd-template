import type {
  TaskListQueryServiceInterface,
  TaskListQueryServicePayload,
} from "../../application/query-service/task-list-query-service";
import { getDatabase } from "../../libs/drizzle/get-database";
import { tasks } from "../../libs/drizzle/schema";

export class PostgresqlTaskListQueryService
  implements TaskListQueryServiceInterface
{
  public async invoke(): Promise<TaskListQueryServicePayload> {
    return getDatabase()
      .select({
        id: tasks.id,
        title: tasks.title,
        done: tasks.done,
      })
      .from(tasks);
  }
}
