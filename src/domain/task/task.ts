import { z } from "zod";
import { ulid } from "../../libs/ulid";

export class Task {
  readonly #id: string;
  #title: string;
  #isDone: boolean;

  private readonly titleSchema = z
    .string()
    .min(1, "title must not be empty")
    .max(100, "title must be less than 100 characters");

  public constructor(
    props: { title: string } | { id: string; title: string; done: boolean },
  ) {
    const fromData = "id" in props;
    if (fromData) {
      this.#id = props.id;
      this.#title = props.title;
      this.#isDone = props.done;
    } else {
      this.#id = ulid();
      this.#title = this.titleSchema.parse(props.title);
      this.#isDone = false;
    }
  }

  public get id() {
    return this.#id;
  }

  public get title() {
    return this.#title;
  }

  public get isDone() {
    return this.#isDone;
  }

  public edit(title: string) {
    this.#title = this.titleSchema.parse(title);
  }

  public done() {
    this.#isDone = true;
  }
}
