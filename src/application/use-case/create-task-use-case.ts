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
  public constructor(
    private readonly taskRepository: TaskRepositoryInterface,
  ) {}

  public async invoke(
    input: CreateTaskUseCaseInput,
  ): Promise<CreateTaskUseCasePayload> {
    const task = new Task(input);

    const savedTask = await this.taskRepository.save(task);

    return {
      id: savedTask.id,
      title: savedTask.title,
      done: savedTask.isDone,
    };
  }
}
