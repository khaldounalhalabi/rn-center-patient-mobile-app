import { Prescription } from "@/models/Prescriptions";
import { BaseService } from "@/services/BaseService";

export class PrescriptionService extends BaseService<
  PrescriptionService,
  Prescription
>() {
  public getBaseUrl(): string {
    return `customer/prescriptions`;
  }
}
