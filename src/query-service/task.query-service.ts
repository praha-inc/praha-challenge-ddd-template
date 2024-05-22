export type TaskQueryServiceInterface = (
  id: string,
) => Promise<{ id: string; title: string; done: boolean } | undefined>;
