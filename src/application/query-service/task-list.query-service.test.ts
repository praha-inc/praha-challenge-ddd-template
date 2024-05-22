import { TaskListQueryService } from "./task-list.query-service";

describe("TaskListQueryService", () => {
  describe("タスク一覧の取得に成功したとき", () => {
    const mockTaskData = [
      { id: "1", title: "Task 1", done: false },
      { id: "2", title: "Task 2", done: true },
    ];
    const mockImplementation = jest
      .fn()
      .mockResolvedValue({ result: "success", data: mockTaskData });
    const queryService = new TaskListQueryService(mockImplementation);
    let result: Awaited<ReturnType<typeof queryService.execute>>;

    beforeEach(async () => {
      result = await queryService.execute();
    });

    test("成功の結果が返される", () => {
      expect(result).toEqual({ result: "success", data: mockTaskData });
    });
  });

  describe("タスク一覧の取得に失敗したとき", () => {
    const mockError = new Error("Failed to fetch task data");
    const mockImplementation = jest
      .fn()
      .mockResolvedValue({ result: "failure", error: mockError });
    const queryService = new TaskListQueryService(mockImplementation);
    let result: Awaited<ReturnType<typeof queryService.execute>>;

    beforeEach(async () => {
      result = await queryService.execute();
    });

    test("失敗の結果が返される", () => {
      expect(result).toEqual({ result: "failure", error: mockError });
    });
  });
});
