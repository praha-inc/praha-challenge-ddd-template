import { eq, sql } from "drizzle-orm";
import { Task } from "../../domain/task/task";
import type { TaskRepositoryInterface } from "../../domain/task/task-repository";
import { getDatabase } from "../../libs/drizzle/get-database";
import { tasks } from "../../libs/drizzle/schema";

export class PostgresqlTaskRepository implements TaskRepositoryInterface {
  private readonly database: ReturnType<typeof getDatabase>;

  public constructor() {
    this.database = getDatabase();
  }

  public async save(task: Task) {
    const [row] = await this.database
      .insert(tasks)
      .values({
        id: task.getId(),
        title: task.getTitle(),
        done: task.isDone(),
      })
      .onConflictDoUpdate({
        target: tasks.id,
        set: {
          title: sql.raw(`excluded.${tasks.title.name}`),
          done: sql.raw(`excluded.${tasks.done.name}`),
        },
      })
      .returning();

    if (!row) {
      throw new Error("Failed to save a task");
    }

    return new Task(row);
  }

  public async findById(id: string) {
    const [row] = await this.database
      .select()
      .from(tasks)
      .where(eq(tasks.id, id));

    if (!row) {
      return undefined;
    }

    return new Task(row);
  }
}
