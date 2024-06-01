import { eq, sql } from "drizzle-orm";
import { Task } from "../../domain/task/task";
import type { TaskRepositoryInterface } from "../../domain/task/task-repository";
import type { Database } from "../../libs/drizzle/get-database";
import { tasks } from "../../libs/drizzle/schema";

export class PostgresqlTaskRepository implements TaskRepositoryInterface {
  public constructor(private readonly database: Database) {}

  public async save(task: Task) {
    const [row] = await this.database
      .insert(tasks)
      .values({
        id: task.id,
        title: task.title,
        done: task.isDone,
      })
      .onConflictDoUpdate({
        target: tasks.id,
        set: {
          title: sql.raw(`excluded.${tasks.title.name}`),
          done: sql.raw(`excluded.${tasks.done.name}`),
        },
      })
      .returning({
        id: tasks.id,
        title: tasks.title,
        done: tasks.done,
      });

    if (!row) {
      throw new Error("Failed to save a task");
    }

    return new Task({
      id: row.id,
      title: row.title,
      done: row.done,
    });
  }

  public async findById(id: string) {
    const [row] = await this.database
      .select({
        id: tasks.id,
        title: tasks.title,
        done: tasks.done,
      })
      .from(tasks)
      .where(eq(tasks.id, id));

    if (!row) {
      return undefined;
    }

    return new Task({
      id: row.id,
      title: row.title,
      done: row.done,
    });
  }
}
