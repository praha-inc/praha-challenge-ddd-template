export interface TaskListQueryServiceInterface {
  invoke: () => Promise<
    | {
        result: "success";
        data: { id: string; title: string; done: boolean }[];
      }
    | { result: "failure"; error: Error }
  >;
}
