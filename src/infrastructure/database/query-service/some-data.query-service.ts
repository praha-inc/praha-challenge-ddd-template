import { getDatabase } from "../../../libs/drizzle/get-database";
import { someData } from "../../../libs/drizzle/schema";
import type { SomeDataQueryService } from "../../../query-service/some-data.query-service";

export const someDataQueryService: SomeDataQueryService = async () => {
  const database = getDatabase();
  const data = await database.select().from(someData);

  return data;
};
