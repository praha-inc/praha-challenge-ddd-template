import { Task } from "../../domain/task/task";
import type { TaskRepositoryInterface } from "../../domain/task/task-repository";

type Payload = Promise<
  | {
      result: "success";
      data: {
        id: string;
        title: string;
        done: boolean;
      };
    }
  | { result: "failure"; error: Error }
>;
export class CreateTaskUsecase {
  private readonly repository: TaskRepositoryInterface;

  public constructor(repository: TaskRepositoryInterface) {
    this.repository = repository;
  }

  public async execute(title: string): Payload {
    try {
      const task = new Task({ title });

      const payload = await this.repository.save(task);

      if (payload.result !== "success") {
        return payload;
      }

      return {
        result: "success",
        data: {
          id: payload.data.getId(),
          title: payload.data.getTitle(),
          done: payload.data.isDone(),
        },
      };
    } catch (error) {
      return {
        result: "failure",
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
    }
  }
}
