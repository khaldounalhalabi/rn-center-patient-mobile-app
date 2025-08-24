import { Clinic } from "./Clinic";
import { ServiceCategory } from "@/models/ServiceCategory";
import { Media } from "@/models/Media";

export interface Service {
  id: number;
  name: string;
  approximate_duration: number;
  service_category_id: number;
  price: number;
  description: string;
  clinic_id: number;
  service_category?: ServiceCategory;
  clinic?: Clinic;
  icon?: Media[];
}
