import { Task } from "../../domain/task/task";
import type { TaskRepositoryInterface } from "../../domain/task/task.repository";
import { CreateTaskUsecase } from "./create-task-usecase";

describe("CreateTaskUsecase", () => {
  let usecase: CreateTaskUsecase;
  let repository: TaskRepositoryInterface;

  const title = "洗濯物をしまう";

  describe("タスクを作成する", () => {
    let result: Awaited<ReturnType<typeof usecase.execute>>;

    beforeEach(async () => {
      repository = {
        save: jest.fn().mockResolvedValueOnce({
          result: "success",
          data: new Task({ title }),
        }),
      };
      usecase = new CreateTaskUsecase(repository);
      result = await usecase.execute(title);
    });

    test("作成されたタスクを取得できる", async () => {
      expect(result.result).toBe("success");
      if (result.result === "success") {
        expect(result.data.getTitle()).toBe(title);
      }
    });
  });

  describe("repositoryでエラーが発生した場合", () => {
    let result: Awaited<ReturnType<typeof usecase.execute>>;
    const message = "Repository error";

    beforeEach(async () => {
      repository = {
        save: jest.fn().mockRejectedValueOnce(new Error(message)),
      };
      usecase = new CreateTaskUsecase(repository);
      result = await usecase.execute(title);
    });

    test("failureが返される", async () => {
      expect(result.result).toBe("failure");
      if (result.result === "failure") {
        expect(result.error.message).toBe(message);
      }
    });
  });
});
