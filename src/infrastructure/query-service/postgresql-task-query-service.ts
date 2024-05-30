import { eq } from "drizzle-orm";
import type { TaskQueryServiceInterface } from "../../application/query-service/task-query-service";
import { getDatabase } from "../../libs/drizzle/get-database";
import { tasks } from "../../libs/drizzle/schema";

export class PostgresqlTaskQueryService implements TaskQueryServiceInterface {
  public async invoke(id: string) {
    try {
      const database = getDatabase();

      const [data] = await database
        .select({
          id: tasks.id,
          title: tasks.title,
          done: tasks.done,
        })
        .from(tasks)
        .where(eq(tasks.id, id));

      if (!data) {
        return { result: "not-found" as const };
      }

      return { result: "success" as const, data };
    } catch (error) {
      return {
        result: "failure" as const,
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
    }
  }
}
