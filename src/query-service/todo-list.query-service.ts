export type TodoListQueryServiceInterface = () => Promise<
  { id: string; title: string; done: boolean }[]
>;
