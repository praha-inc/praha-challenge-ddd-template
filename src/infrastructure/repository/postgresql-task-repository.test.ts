import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { Task } from "../../domain/task/task";
import { getDatabase } from "../../libs/drizzle/get-database";
import { tasks } from "../../libs/drizzle/schema";
import { PostgresqlTaskRepository } from "./postgresql-task-repository";

const generateTestTasks = (count: number): Task[] => {
  return Array.from({ length: count }).map((_, i) => {
    return new Task({
      id: `test-id-${i}`,
      title: `test-title-${i}`,
      done: false,
    });
  });
};

describe("PostgresqlTaskRepository", () => {
  const database = getDatabase();
  const postgresqlTaskRepository = new PostgresqlTaskRepository(database);

  beforeEach(async () => {
    const testTasks = generateTestTasks(3);

    await database
      .insert(tasks)
      .values(
        testTasks.map((task) => ({
          id: task.id,
          title: task.title,
          done: task.isDone,
        })),
      )
      .execute();
  });

  afterEach(async () => {
    await database.delete(tasks).execute();
  });

  describe("findById", () => {
    describe("指定したIDのタスクが存在する場合", () => {
      const existingTaskId = "test-id-0";

      test("指定したIDのタスクを返す", async () => {
        const task = await postgresqlTaskRepository.findById(existingTaskId);
        expect(task).toMatchObject({
          id: existingTaskId,
          title: "test-title-0",
          isDone: false,
        });
      });
    });

    describe("指定したIDのタスクが存在しない場合", () => {
      const notFoundTaskId = "not-found";

      test("undefinedを返す", async () => {
        const task = await postgresqlTaskRepository.findById(notFoundTaskId);
        expect(task).toBeUndefined();
      });
    });
  });

  describe("save", () => {
    describe("新しいタスクの場合", () => {
      const newTask = new Task({
        id: "test-id-4",
        title: "new-task",
        done: false,
      });

      test("新しいタスクがDBにINSERTされる", async () => {
        await postgresqlTaskRepository.save(newTask);
        const savedTask = await postgresqlTaskRepository.findById(newTask.id);
        expect(savedTask).toBeDefined();
      });
    });

    describe("既存のタスクの場合", async () => {
      const existingTaskId = "test-id-1";

      test("既存のタスクが更新される", async () => {
        const existingTask =
          await postgresqlTaskRepository.findById(existingTaskId);
        if (!existingTask) throw new Error("Test task1 should be inserted");

        existingTask.makeAsDone();
        await postgresqlTaskRepository.save(existingTask);
        const savedTask = await postgresqlTaskRepository.findById(
          existingTask.id,
        );

        expect(savedTask).toMatchObject({
          id: existingTask.id,
          title: existingTask.title,
          isDone: true,
        });
      });
    });
  });
});
