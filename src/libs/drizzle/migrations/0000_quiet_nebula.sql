CREATE TABLE IF NOT EXISTS "some_data" (
	"id" varchar NOT NULL,
	"required" boolean NOT NULL,
	"number" smallint NOT NULL,
	CONSTRAINT "some_data_pk" PRIMARY KEY("id")
);
