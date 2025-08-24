import MedicinePrescriptionStatusEnum from "@/enums/MedicinePrescriptionStatusEnum";
import { Medicine } from "@/models/Medicine";

interface MedicinePrescription {
  id: number;
  prescription_id: number;
  medicine_id: number;
  dosage?: string;
  dose_interval?: string;
  comment?: string;
  status?: MedicinePrescriptionStatusEnum;
  medicine?: Medicine;
}

export default MedicinePrescription;
