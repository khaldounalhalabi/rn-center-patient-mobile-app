import MedicinePrescription from "@/models/MedicinePrescription";
import { Clinic } from "@/models/Clinic";
import { Customer } from "@/models/Customer";
import { Appointment } from "@/models/Appointment";

export interface Prescription {
  id: number;
  clinic_id: number;
  customer_id: number;
  appointment_id?: number;
  other_data: { key: string; value: string }[];
  created_at: string;
  next_visit?: string;
  medicines?: MedicinePrescription[];
  clinic?: Clinic;
  customer?: Customer;
  appointment?: Appointment;
}
