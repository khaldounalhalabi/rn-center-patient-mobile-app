import { User } from "@/models/User";
import { Speciality } from "@/models/Speciality";

export type Clinic = {
  id: number;
  appointment_cost: number;
  user_id: number;
  working_start_year: string;
  experience_years: number;
  max_appointments: number;
  user?: User;
  total_appointments: number;
  today_appointments_count: number;
  upcoming_appointments_count: number;
  specialities?: Speciality[];
};
