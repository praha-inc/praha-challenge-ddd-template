export type TaskQueryServiceInput = {
  id: string;
};

export type TaskQueryServicePayload = {
  id: string;
  title: string;
  done: boolean;
};

export interface TaskQueryServiceInterface {
  invoke: (
    input: TaskQueryServiceInput,
  ) => Promise<TaskQueryServicePayload | undefined>;
}
