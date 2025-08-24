import LoadingSpinner from "@/components/LoadingSpinner";
import Select from "@/components/inputs/Select";
import { toast } from "@/components/toast/toast";
import { RoleEnum } from "@/enums/RoleEnum";
import TaskStatusEnum from "@/enums/TaskStatusEnum";
import { getEnumValues } from "@/helpers/helpers";
import { useTranslation } from "@/localization";
import Task from "@/models/Task";
import TaskService from "@/services/TaskService";
import { useEffect, useState } from "react";

const TaskStatusColumn = ({
  task,
}: {
  task?: Task;
}) => {
  const [status, setStatus] = useState<TaskStatusEnum>(
    task?.status ?? TaskStatusEnum.PENDING,
  );
  const [loading, setLoading] = useState(false);
  const service = TaskService.make(RoleEnum.SECRETARY);
  const { t } = useTranslation();
  const onChange = async (value: TaskStatusEnum | string) => {
    setLoading(true);
    const res = await service.changeStatus(
      task?.id ?? 0,
      value as TaskStatusEnum,
    );
    if (res.ok()) {
      setStatus(res.data ?? status);
      toast.success(res.message as string);
    } else {
      toast.error(res.message as string);
    }
    setLoading(false);
  };

  useEffect(() => {
    setStatus(task?.status ?? TaskStatusEnum.PENDING);
  }, [task]);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <Select
      selected={status}
      onChange={onChange}
      data={getEnumValues(TaskStatusEnum)}
      label={t("tasks.status")}
      translated
    />
  );
};

export default TaskStatusColumn;
