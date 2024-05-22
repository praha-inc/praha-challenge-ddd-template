export type SomeDataQueryService = () => Promise<Payload>;
type Payload =
  | {
      id: string;
      required: boolean;
      number: number;
    }[]
  | undefined;
