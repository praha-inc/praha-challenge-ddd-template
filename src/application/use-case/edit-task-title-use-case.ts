import type { TaskRepositoryInterface } from "../../domain/task/task-repository";

export type EditTaskTitleUseCaseInput = {
  taskId: string;
  title: string;
};

export type EditTaskTitleUseCasePayload = {
  id: string;
  title: string;
  done: boolean;
};

export class EditTaskTitleUseCaseNotFoundError extends Error {
  public override readonly name = "EditTaskTitleUseCaseNotFoundError";

  public constructor() {
    super("task not found");
  }
}

export class EditTaskTitleUseCase {
  private readonly repository: TaskRepositoryInterface;

  public constructor(repository: TaskRepositoryInterface) {
    this.repository = repository;
  }

  public async invoke(
    input: EditTaskTitleUseCaseInput,
  ): Promise<EditTaskTitleUseCasePayload> {
    const task = await this.repository.findById(input.taskId);
    if (!task) {
      throw new EditTaskTitleUseCaseNotFoundError();
    }

    task.edit(input.title);

    const savedTask = await this.repository.save(task);

    return {
      id: savedTask.getId(),
      title: savedTask.getTitle(),
      done: savedTask.isDone(),
    };
  }
}
