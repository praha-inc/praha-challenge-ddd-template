export interface TaskQueryServiceInterface {
  invoke: (
    id: string,
  ) => Promise<
    | { result: "success"; data: { id: string; title: string; done: boolean } }
    | { result: "not-found" }
    | { result: "failure"; error: Error }
  >;
}
