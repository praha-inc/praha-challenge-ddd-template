import { Task } from "../../domain/task/task";
import type { TaskRepositoryInterface } from "../../domain/task/task-repository";

type Payload = Promise<
  | { result: "success"; data: Task }
  | { result: "not-found" }
  | { result: "failure"; error: Error }
>;
export class EditTaskTitleUsecase {
  private readonly repository: TaskRepositoryInterface;

  public constructor(repository: TaskRepositoryInterface) {
    this.repository = repository;
  }

  public async execute(props: {
    task: { id: string; title: string; done: boolean };
    title: string;
  }): Payload {
    try {
      const task = new Task(props.task);
      task.edit(props.title);

      const payload = await this.repository.save(task);

      return payload;
    } catch (error) {
      return {
        result: "failure",
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
    }
  }
}
