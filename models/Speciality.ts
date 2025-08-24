import { Media } from "@/models/Media";

export interface Speciality {
  id: number;
  name: string;
  description: string;
  tags: string;
  image: Media[];
  clinics_count?: number;
}
