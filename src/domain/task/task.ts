import { ulid } from "ulid";
import { z } from "zod";

export class Task {
  private readonly id: string;
  private title: string;
  private done: boolean;

  private readonly titleSchema = z
    .string()
    .min(1, "title must not be empty")
    .max(100, "title must be less than 100 characters");

  public constructor(
    props: { title: string } | { id: string; title: string; done: boolean },
  ) {
    const fromData = "id" in props;
    if (fromData) {
      this.id = props.id;
      this.title = props.title;
      this.done = props.done;
    } else {
      this.id = ulid();
      this.title = this.titleSchema.parse(props.title);
      this.done = false;
    }
  }

  public getId() {
    return this.id;
  }

  public getTitle() {
    return this.title;
  }

  public isDone() {
    return this.done;
  }

  public edit(title: string) {
    this.title = this.titleSchema.parse(title);
  }

  public do() {
    this.done = true;
  }
}
