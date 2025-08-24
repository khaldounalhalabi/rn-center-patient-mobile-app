import GenderEnum from "@/enums/GenderEnum";
import PermissionEnum from "@/enums/PermissionEnum";
import { RoleEnum } from "@/enums/RoleEnum";
import AttendanceLog from "@/models/AttendanceLog";
import { Clinic } from "@/models/Clinic";
import Formula from "@/models/Formula";

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email?: string;
  phone: string;
  phone_verified_at?: string;
  gender: GenderEnum;
  role: RoleEnum;
  attendance_by_date?: AttendanceLog[];
  clinic?: Clinic;
  formula?: Formula;
  permissions?: PermissionEnum[];
}

export interface AuthResponse {
  user: User;
  token?: string;
  refresh_token?: string;
}
