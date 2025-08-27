import { GET } from "@/http/Http";
import { ApiResponse } from "@/http/Response";
import { Service } from "@/models/Service";
import { BaseService } from "@/services/BaseService";

export class ServiceService extends BaseService<ServiceService, Service>() {
  public getBaseUrl(): string {
    return `/services`;
  }

  public async getClinicService(
    clinicId: number | undefined,
    page: number = 0,
    search?: string,
    sortCol?: string,
    sortDir?: string,
    per_page?: number,
    headers?: Record<string, any>,
    params?: object,
  ): Promise<ApiResponse<Service[]>> {
    const res = await GET<Service[]>(
      `${this.role}/clinics/${clinicId}/services`,
      {
        page: page,
        search: search,
        sort_col: sortCol,
        sort_dir: sortDir,
        per_page: per_page,
        ...params,
      },
      headers,
    );
    return await this.errorHandler(res);
  }
}
