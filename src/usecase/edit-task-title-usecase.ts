import { Task } from "../domain/task/task";
import type { TaskRepositoryInterface } from "../domain/task/task.repository";
import type { TaskQueryService } from "../query-service/task.query-service";

type Payload = Promise<
  | { result: "success"; data: Task }
  | { result: "not-found" }
  | { result: "failure"; error: Error }
>;
export class EditTaskTitleUsecase {
  private readonly repository: TaskRepositoryInterface;
  private readonly queryService: TaskQueryService;

  public constructor(
    repository: TaskRepositoryInterface,
    queryService: TaskQueryService,
  ) {
    this.repository = repository;
    this.queryService = queryService;
  }

  public async execute(props: { id: string; title: string }): Payload {
    try {
      const data = await this.queryService(props.id);

      if (!data) {
        return { result: "not-found" };
      }
      const task = new Task(data);
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
