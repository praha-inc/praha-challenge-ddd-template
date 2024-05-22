export type TaskListQueryServiceInterface = () => Promise<
  | { result: "success"; data: { id: string; title: string; done: boolean }[] }
  | { result: "failure"; error: Error }
>;

export class TaskListQueryService {
  private readonly implementation: TaskListQueryServiceInterface;

  public constructor(implementation: TaskListQueryServiceInterface) {
    this.implementation = implementation;
  }

  public async execute() {
    return this.implementation();
  }
}
