import TaskStatusEnum from "@/enums/TaskStatusEnum";
import { GET, POST } from "@/http/Http";
import Task from "@/models/Task";
import { BaseService } from "@/services/BaseService";

class TaskService extends BaseService<TaskService, Task>() {
  getBaseUrl(): string {
    return `/${this.role}/tasks`;
  }

  public async changeStatus(taskId: number, status: TaskStatusEnum) {
    const response = await POST<TaskStatusEnum | undefined>(
      `${this.baseUrl}/change-status`,
      {
        task_id: taskId,
        status: status,
      },
      this.headers,
    );

    return this.errorHandler(response);
  }

  public async mine(
    page: number = 0,
    search?: string,
    sortCol?: string,
    sortDir?: string,
    per_page?: number,
    params?: object,
  ) {
    const response = await GET<Task[]>(
      `${this.baseUrl}/mine`,
      {
        page: page,
        search: search,
        sort_col: sortCol,
        sort_dir: sortDir,
        per_page: per_page,
        ...params,
      },
      this.headers,
    );

    return this.errorHandler(response);
  }
}

export default TaskService;
