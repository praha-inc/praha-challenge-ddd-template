import { eq } from "drizzle-orm";
import type {
  TaskQueryServiceInput,
  TaskQueryServiceInterface,
  TaskQueryServicePayload,
} from "../../application/query-service/task-query-service";
import type { Database } from "../../libs/drizzle/get-database";
import { tasks } from "../../libs/drizzle/schema";

export class PostgresqlTaskQueryService implements TaskQueryServiceInterface {
  public constructor(private readonly database: Database) {}

  public async invoke(
    input: TaskQueryServiceInput,
  ): Promise<TaskQueryServicePayload | undefined> {
    const [row] = await this.database
      .select({
        id: tasks.id,
        title: tasks.title,
        done: tasks.done,
      })
      .from(tasks)
      .where(eq(tasks.id, input.id));

    return row;
  }
}
