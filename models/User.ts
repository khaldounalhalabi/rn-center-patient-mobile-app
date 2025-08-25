import GenderEnum from "@/enums/GenderEnum";
import PermissionEnum from "@/enums/PermissionEnum";
import { RoleEnum } from "@/enums/RoleEnum";
import { Customer } from "./Customer";

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  phone: string;
  phone_verified_at?: string;
  gender: GenderEnum;
  role: RoleEnum;
  permissions?: PermissionEnum[];
  customer?: Customer;
}

export interface AuthResponse {
  user: User;
  token?: string;
  refresh_token?: string;
}
