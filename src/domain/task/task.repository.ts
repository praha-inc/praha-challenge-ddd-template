import type { Task } from "./task";

export type TaskRepositoryInterface = {
  save: (
    task: Task,
  ) => Promise<
    { result: "success"; data: Task } | { result: "failure"; error: Error }
  >;
};
