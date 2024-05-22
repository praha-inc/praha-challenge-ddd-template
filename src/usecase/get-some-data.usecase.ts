import type { SomeDataQueryService } from "../query-service/some-data.query-service";

type GetSomeDataUsecase = (
  queryService: SomeDataQueryService,
) => Promise<
  | {
      result: "success";
      data: { id: string; required: boolean; number: number }[];
    }
  | { result: "not-found" }
  | { result: "failure"; error: Error }
>;
export const getSomeDataUsecase: GetSomeDataUsecase = async (queryService) => {
  try {
    const data = await queryService();

    if (!data) {
      return { result: "not-found" };
    }

    return { result: "success", data };
  } catch (error) {
    return {
      result: "failure",
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};
