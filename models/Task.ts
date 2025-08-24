import TaskLabelEnum from "@/enums/TaskLabelEnum";
import TaskStatusEnum from "@/enums/TaskStatusEnum";
import TaskComment from "@/models/TaskComment";
import { User } from "@/models/User";

interface Task {
  id: number;
  title: string;
  description: string;
  due_date?: string;
  status: TaskStatusEnum;
  label?: TaskLabelEnum;
  user_id: number;
  users?: User[];
  user?: User;
  can_toggle_status: boolean;
  can_delete: boolean;
  can_comment: boolean;
  can_update: boolean;
  task_comments?: TaskComment[];
  issued_at: string;
}

export default Task;
