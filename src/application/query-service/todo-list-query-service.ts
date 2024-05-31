export type TodoListQueryServicePayload = Array<{
  id: string;
  title: string;
  done: boolean;
}>;

export interface TodoListQueryServiceInterface {
  invoke: () => Promise<TodoListQueryServicePayload>;
}
