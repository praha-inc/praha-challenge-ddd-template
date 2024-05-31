export type TaskListQueryServicePayload = Array<{
  id: string;
  title: string;
  done: boolean;
}>;

export interface TaskListQueryServiceInterface {
  invoke: () => Promise<TaskListQueryServicePayload>;
}
