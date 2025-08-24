import { Clinic } from "@/models/Clinic";
import { Customer } from "@/models/Customer";

interface MedicalRecord {
  id: number;
  customer_id: number;
  clinic_id: number;
  summary?: string;
  diagnosis?: string;
  treatment?: string;
  allergies?: string;
  notes?: string;
  can_delete?: boolean;
  can_update?: boolean;

  customer?: Customer;
  clinic?: Clinic;
}
export default MedicalRecord;
