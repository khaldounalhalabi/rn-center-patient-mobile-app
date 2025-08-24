import { GET } from "@/http/Http";
import { ApiResponse } from "@/http/Response";
import { Schedule, SchedulesCollection } from "@/models/Schedule";
import { BaseService } from "@/services/BaseService";

export class ScheduleService extends BaseService<
  ScheduleService,
  Schedule | SchedulesCollection
>() {
  public getBaseUrl(): string {
    return `${this.role}/schedules`;
  }

  public async getClinicSchedules(
    clinicId: number,
  ): Promise<ApiResponse<SchedulesCollection>> {
    const res = await GET(
      `${this.role}/clinics/${clinicId}/schedules`,
      undefined,
      this.headers,
    );
    return (await this.errorHandler(res)) as ApiResponse<SchedulesCollection>;
  }

  public getUserSchedules = async (userId: number) => {
    const res = await GET<SchedulesCollection>(
      `${this.role}/users/${userId}/schedules`,
      undefined,
      this.headers,
    );

    return await this.errorHandler(res);
  };

  public async mine() {
    const response = await GET<SchedulesCollection>(`/${this.role}/schedule`);
    return this.errorHandler(response);
  }
}
