import type { TaskQueryService } from "../query-service/task.query-service";

type Payload = Promise<
  | { result: "success"; data: { id: string; title: string; done: boolean } }
  | { result: "not-found" }
  | { result: "failure"; error: Error }
>;
export class GetTaskByIdUsecase {
  private readonly queryService: TaskQueryService;

  public constructor(queryService: TaskQueryService) {
    this.queryService = queryService;
  }

  public async execute(id: string): Payload {
    try {
      const data = await this.queryService(id);

      if (!data) {
        return { result: "not-found" };
      }

      return { result: "success", data };
    } catch (error) {
      return {
        result: "failure",
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
    }
  }
}
