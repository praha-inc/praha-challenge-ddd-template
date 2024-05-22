export class SomeData {
  public constructor(
    private readonly id: string,
    private readonly required: boolean,
    private readonly number: number,
  ) {}

  public getAllProperties() {
    return {
      id: this.id,
      required: this.required,
      number: this.number,
    };
  }
}
