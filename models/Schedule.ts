import WeekDayEnum from "@/enums/WeekDayEnum";
import { Clinic } from "@/models/Clinic";

export interface Schedule {
  id?: number;
  start_time: string;
  end_time: string;
  day_of_week: WeekDayEnum | string;
  clinic_id?: number;
  clinic?: Clinic;
}

export interface SchedulesCollection extends Record<WeekDayEnum, Schedule[]> {}
