import TaskComment from "@/models/TaskComment";
import { BaseService } from "@/services/BaseService";

export class TaskCommentService extends BaseService<
  TaskCommentService,
  TaskComment
>() {
  getBaseUrl(): string {
    return `/customer/task-comments`;
  }
}
