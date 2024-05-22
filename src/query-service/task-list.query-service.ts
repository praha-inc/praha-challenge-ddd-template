export type TaskListQueryService = () => Promise<
  {
    id: string;
    title: string;
    done: boolean;
  }[]
>;
