import MedicalRecord from "@/models/MedicalRecord";
import { BaseService } from "@/services/BaseService";

class MedicalRecordService extends BaseService<
  MedicalRecordService,
  MedicalRecord
>() {
  getBaseUrl(): string {
    return `customer/medical-records`;
  }
}

export default MedicalRecordService;
