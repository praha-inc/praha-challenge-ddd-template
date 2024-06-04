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
  public constructor(
    private readonly taskRepository: TaskRepositoryInterface,
  ) {}

  public async invoke(
    input: EditTaskTitleUseCaseInput,
  ): Promise<EditTaskTitleUseCasePayload> {
    const task = await this.taskRepository.findById(input.taskId);
    if (!task) {
      throw new EditTaskTitleUseCaseNotFoundError();
    }

    task.edit(input.title);

    const savedTask = await this.taskRepository.save(task);

    return {
      id: savedTask.id,
      title: savedTask.title,
      done: savedTask.isDone,
    };
  }
}
