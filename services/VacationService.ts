import { GET } from "@/http/Http";
import Vacation from "@/models/Vacation";
import { BaseService } from "./BaseService";

class VacationService extends BaseService<VacationService, Vacation>() {
  public getBaseUrl(): string {
    return `${this.role}/vacations`;
  }

  public async myActiveVacations() {
    const response = await GET<Vacation[]>(`/${this.role}/vacations/active`);

    return this.errorHandler(response);
  }

  public async mine(
    page?: number,
    search?: string,
    params?: Record<string, any>,
  ) {
    const response = await GET<Vacation[]>(`/${this.role}/vacations/mine`, {
      page: page,
      search: search,
      ...params,
    });

    return this.errorHandler(response);
  }
}

export default VacationService;
