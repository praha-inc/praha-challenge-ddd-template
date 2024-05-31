import { Task } from "../../domain/task/task";
import type { TaskRepositoryInterface } from "../../domain/task/task-repository";

export type SetTaskDoneUseCaseInput = {
  task: { id: string; title: string; done: boolean };
};

export type SetTaskDoneUseCasePayload = {
  id: string;
  title: string;
  done: boolean;
};

export class SetTaskDoneUseCase {
  private readonly repository: TaskRepositoryInterface;

  public constructor(repository: TaskRepositoryInterface) {
    this.repository = repository;
  }

  public async execute(
    input: SetTaskDoneUseCaseInput,
  ): Promise<SetTaskDoneUseCasePayload> {
    const task = new Task(input.task);
    task.do();

    const savedTask = await this.repository.save(task);

    return {
      id: savedTask.getId(),
      title: savedTask.getTitle(),
      done: savedTask.isDone(),
    };
  }
}
