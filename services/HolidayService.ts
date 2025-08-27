import { GET } from "@/http/Http";
import { Holiday } from "@/models/Holiday";
import { BaseService } from "@/services/BaseService";

export class HolidayService extends BaseService<HolidayService, Holiday>() {
  public getBaseUrl(): string {
    return `/holidays`;
  }

  public activeHolidays = async () => {
    const response = await GET<Holiday[]>(`customer/holidays/active`);
    return this.errorHandler(response);
  };
}
