import { z } from "zod";

export type Credentials = ReturnType<typeof getCredentials>;

export const getCredentials = () => {
  const DB_HOST = z.string().parse(process.env["DB_HOST"]);
  const DB_PORT = z
    .preprocess(Number, z.number().int())
    .parse(process.env["DB_PORT"]);
  const DB_USER = z.string().parse(process.env["DB_USER"]);
  const DB_PASSWORD = z.string().parse(process.env["DB_PASSWORD"]);
  const DB_NAME = z.string().parse(process.env["DB_NAME"]);

  return {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
  };
};
