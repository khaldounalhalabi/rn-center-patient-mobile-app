import { User } from "@/models/User";

interface TaskComment {
  id: number;
  user_id: number;
  task_id: number;
  comment: string;
  can_delete: boolean;
  can_update: boolean;
  user?: User;
}

export default TaskComment;
