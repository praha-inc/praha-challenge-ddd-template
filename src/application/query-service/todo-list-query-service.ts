export type TodoListQueryServiceInterface = () => Promise<
  | { result: "success"; data: { id: string; title: string; done: boolean }[] }
  | { result: "failure"; error: Error }
>;

export class TodoListQueryService {
  private readonly implementation: TodoListQueryServiceInterface;

  public constructor(implementation: TodoListQueryServiceInterface) {
    this.implementation = implementation;
  }

  public async execute() {
    return this.implementation();
  }
}
