import { Clinic } from "@/models/Clinic";
import { BaseService } from "@/services/BaseService";

export class ClinicsService extends BaseService<ClinicsService, Clinic>() {
  getBaseUrl(): string {
    return `/clinics`;
  }
}
