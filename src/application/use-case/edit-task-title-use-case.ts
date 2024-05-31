import { Task } from "../../domain/task/task";
import type { TaskRepositoryInterface } from "../../domain/task/task-repository";

export type EditTaskTitleUseCaseInput = {
  task: { id: string; title: string; done: boolean };
  title: string;
};

export type EditTaskTitleUseCasePayload = {
  id: string;
  title: string;
  done: boolean;
};

export class EditTaskTitleUseCase {
  private readonly repository: TaskRepositoryInterface;

  public constructor(repository: TaskRepositoryInterface) {
    this.repository = repository;
  }

  public async invoke(
    input: EditTaskTitleUseCaseInput,
  ): Promise<EditTaskTitleUseCasePayload> {
    const task = new Task(input.task);
    task.edit(input.title);

    const savedTask = await this.repository.save(task);

    return {
      id: savedTask.getId(),
      title: savedTask.getTitle(),
      done: savedTask.isDone(),
    };
  }
}
