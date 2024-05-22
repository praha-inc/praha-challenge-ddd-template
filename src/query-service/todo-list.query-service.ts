export type TodoListQueryService = () => Promise<
  { id: string; title: string; done: boolean }[]
>;
