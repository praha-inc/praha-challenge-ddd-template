export type TaskQueryService = (
  id: string,
) => Promise<{ id: string; title: string; done: boolean } | undefined>;
