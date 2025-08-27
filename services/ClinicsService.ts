import { GET } from "@/http/Http";
import { Clinic } from "@/models/Clinic";
import { BaseService } from "@/services/BaseService";

export class ClinicsService extends BaseService<ClinicsService, Clinic>() {
  getBaseUrl(): string {
    return `/clinics`;
  }

  public async getBySpeciality(
    specialityId: number,
    page?: number,
    search?: string | undefined,
    params?: Record<string, any>,
  ) {
    const response = await GET<Clinic[]>(
      `/specialities/${specialityId}/clinics`,
      {
        page: page,
        search: search,
        ...params,
      },
    );

    return this.errorHandler(response);
  }
}
