import { Speciality } from "@/models/Speciality";
import { BaseService } from "@/services/BaseService";

export class SpecialityService extends BaseService<
  SpecialityService,
  Speciality
>() {
  public getBaseUrl(): string {
    return `/specialities`;
  }
}
