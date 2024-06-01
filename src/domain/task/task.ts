import { z } from "zod";
import { ulid } from "../../libs/ulid";

export class Task {
  private readonly _id: string;
  private _title: string;
  private _isDone: boolean;

  private readonly titleSchema = z
    .string()
    .min(1, "title must not be empty")
    .max(100, "title must be less than 100 characters");

  public constructor(
    props: { title: string } | { id: string; title: string; done: boolean },
  ) {
    const fromData = "id" in props;
    if (fromData) {
      this._id = props.id;
      this._title = props.title;
      this._isDone = props.done;
    } else {
      this._id = ulid();
      this._title = this.titleSchema.parse(props.title);
      this._isDone = false;
    }
  }

  public get id() {
    return this._id;
  }

  public get title() {
    return this._title;
  }

  public get isDone() {
    return this._isDone;
  }

  public edit(title: string) {
    this._title = this.titleSchema.parse(title);
  }

  public done() {
    this._isDone = true;
  }
}
