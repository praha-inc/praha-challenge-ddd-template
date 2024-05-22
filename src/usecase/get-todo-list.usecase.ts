import type { TodoListQueryService } from "../query-service/todo-list.query-service";

type Payload = Promise<
  | { result: "success"; data: { id: string; title: string; done: boolean }[] }
  | { result: "failure"; error: Error }
>;
export class GetTodoListUsecase {
  private readonly queryService: TodoListQueryService;

  public constructor(queryService: TodoListQueryService) {
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
