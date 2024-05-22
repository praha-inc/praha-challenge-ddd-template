import type { TaskListQueryService } from "../query-service/task-list.query-service";

type Payload = Promise<
  | { result: "success"; data: { id: string; title: string; done: boolean }[] }
  | { result: "failure"; error: Error }
>;
export class GetTaskListUsecase {
  private readonly queryService: TaskListQueryService;

  public constructor(queryService: TaskListQueryService) {
    this.queryService = queryService;
  }

  public async execute(): Payload {
    try {
      const data = await this.queryService();

      return { result: "success", data };
    } catch (error) {
      return {
        result: "failure",
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
    }
  }
}
