export type TaskListQueryServiceInterface = () => Promise<
  {
    id: string;
    title: string;
    done: boolean;
  }[]
>;
