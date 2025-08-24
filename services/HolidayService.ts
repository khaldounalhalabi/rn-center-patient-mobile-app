import { BaseService } from "@/services/BaseService";
import { Holiday } from "@/models/Holiday";
import { GET } from "@/http/Http";

export class HolidayService extends BaseService<HolidayService, Holiday>() {
  public getBaseUrl(): string {
    return `${this.role}/holidays`;
  }

  public activeHolidays = async () => {
    const response = await GET<Holiday[]>(`${this.role}/holidays/active`);
    return this.errorHandler(response);
  };
}
