import { Clinic } from "@/models/Clinic";
import WeekDayEnum from "@/enums/WeekDayEnum";

export interface Schedule {
  id?: number;
  start_time: string;
  end_time: string;
  day_of_week: WeekDayEnum | string;
  clinic_id?: number;
  clinic?: Clinic;
}

export interface SchedulesCollection {
  saturday: Schedule[];
  sunday: Schedule[];
  monday: Schedule[];
  tuesday: Schedule[];
  wednesday: Schedule[];
  thursday: Schedule[];
  friday: Schedule[];
}
