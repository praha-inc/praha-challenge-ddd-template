import { Task } from "../../domain/task/task";
import type { TaskRepositoryInterface } from "../../domain/task/task-repository";

export type CreateTaskUseCaseInput = {
  title: string;
};

export type CreateTaskUseCasePayload = {
  id: string;
  title: string;
  done: boolean;
};

export class CreateTaskUseCase {
  private readonly repository: TaskRepositoryInterface;

  public constructor(repository: TaskRepositoryInterface) {
    this.repository = repository;
  }

  public async invoke(
    input: CreateTaskUseCaseInput,
  ): Promise<CreateTaskUseCasePayload> {
    const task = new Task(input);

    const savedTask = await this.repository.save(task);

    return {
      id: savedTask.getId(),
      title: savedTask.getTitle(),
      done: savedTask.isDone(),
    };
  }
}
