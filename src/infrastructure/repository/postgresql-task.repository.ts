import { eq } from "drizzle-orm";
import { Task } from "../../domain/task/task";
import type { TaskRepositoryInterface } from "../../domain/task/task.repository";
import { getDatabase } from "../../libs/drizzle/get-database";
import { tasks } from "../../libs/drizzle/schema";

export class PostgreSQLTaskRepository implements TaskRepositoryInterface {
  private readonly database: ReturnType<typeof getDatabase>;

  public constructor() {
    this.database = getDatabase();
  }

  public async save(task: Task) {
    try {
      const existence = await this.database
        .select({ id: tasks.id })
        .from(tasks)
        .where(eq(tasks.id, task.getId()));
      if (existence.length === 0) {
        const [created] = await this.database
          .insert(tasks)
          .values({
            id: task.getId(),
            title: task.getTitle(),
            done: task.isDone(),
          })
          .returning();
        if (!created) {
          throw new Error("Failed to create a task");
        }

        return {
          result: "success" as const,
          data: new Task(created),
        };
      }

      const [updated] = await this.database
        .update(tasks)
        .set({
          id: task.getId(),
          title: task.getTitle(),
          done: task.isDone(),
        })
        .where(eq(tasks.id, task.getId()))
        .returning();
      if (!updated) {
        throw new Error("Failed to update a task");
      }

      return {
        result: "success" as const,
        data: new Task(updated),
      };
    } catch (error) {
      return {
        result: "failure" as const,
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
    }
  }
}
