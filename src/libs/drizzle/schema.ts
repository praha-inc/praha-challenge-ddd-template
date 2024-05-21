import {
  boolean,
  pgTable,
  primaryKey,
  smallint,
  varchar,
} from "drizzle-orm/pg-core";

export const someData = pgTable(
  "some_data",
  {
    id: varchar("id").notNull(),
    required: boolean("required").notNull(),
    number: smallint("number").notNull(),
  },
  ({ id }) => ({
    pk: primaryKey({ columns: [id], name: "some_data_pk" }),
  }),
);
