import { describe, expect, test } from "vitest";
import { z } from "zod";
import { ulid } from "../../libs/ulid";
import { Task } from "./task";

describe("task", () => {
  describe("タイトルのみでタスクを作成", () => {
    const title = "牛乳を買う";
    const task = new Task({ title });

    test("idがulidで生成される", () => {
      const generated = task.id;
      const isUlid = z.string().ulid().safeParse(generated);

      expect(isUlid.success).toBe(true);
    });

    test("タイトルが設定される", () => {
      expect(task.title).toBe(title);
    });

    test("タスクは未完了", () => {
      expect(task.isDone).toBe(false);
    });
  });

  describe("すべてのプロパティを指定してタスクを作成", () => {
    const id = ulid();
    const title = "卵を買う";
    const done = true;
    const task = new Task({ id, title, done });

    test("指定したプロパティが設定される", () => {
      expect(task.id).toBe(id);
      expect(task.title).toBe(title);
      expect(task.isDone).toBe(done);
    });
  });

  describe("タイトルが空文字の場合", () => {
    const title = "";

    test("エラーが発生する", () => {
      expect(() => new Task({ title })).toThrow("title must not be empty");
    });
  });

  describe("タイトルが100文字を超える場合", () => {
    const title = "a".repeat(101);

    test("エラーが発生する", () => {
      expect(() => new Task({ title })).toThrow(
        "title must be less than 100 characters",
      );
    });
  });

  describe("タイトルを編集する", () => {
    const before = "ご飯を炊く";
    const after = "パスタを茹でる";
    const task = new Task({ title: before });
    task.edit(after);

    test("タイトルが更新される", () => {
      expect(task.title).toBe(after);
    });
  });

  describe("タイトルを空文字に編集する", () => {
    const before = "掃除機をかける";
    const after = "";
    const task = new Task({ title: before });

    test("エラーが発生する", () => {
      expect(() => task.edit(after)).toThrow("title must not be empty");
    });
  });

  describe("タイトルを100文字を超える文字列に編集する", () => {
    const before = "ご飯を炊く";
    const after = "a".repeat(101);
    const task = new Task({ title: before });

    test("エラーが発生する", () => {
      expect(() => task.edit(after)).toThrow(
        "title must be less than 100 characters",
      );
    });
  });

  describe("タスクを完了にする", () => {
    const task = new Task({ title: "洗濯機を回す" });
    task.makeAsDone();

    test("タスクが完了状態になる", () => {
      expect(task.isDone).toBe(true);
    });
  });
});
