export type TaskQueryServiceInterface = (
  id: string,
) => Promise<
  | { result: "success"; data: { id: string; title: string; done: boolean } }
  | { result: "not-found" }
  | { result: "failure"; error: Error }
>;

export class TaskQueryService {
  private readonly implementation: TaskQueryServiceInterface;

  public constructor(implementation: TaskQueryServiceInterface) {
    this.implementation = implementation;
  }

  public async execute(id: string) {
    return this.implementation(id);
  }
}
