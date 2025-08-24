import { GET, POST } from "@/http/Http";
import AttendanceLog from "@/models/AttendanceLog";
import AttendanceStats from "@/models/AttendanceStats";
import UserAttendance from "@/models/UserAttendance";
import { BaseService } from "@/services/BaseService";

class AttendanceLogService extends BaseService<
  AttendanceLogService,
  AttendanceLog
>() {
  getBaseUrl(): string {
    return `${this.role}/attendances`;
  }

  public editOrCreateUserAttendance = async (userId: number, data: any) => {
    const response = await POST<AttendanceLog[]>(
      `/${this.role}/users/${userId}/attendances`,
      data,
      this.headers,
    );

    return this.errorHandler(response);
  };

  public async mine(year: string, month: number) {
    const response = await GET<UserAttendance>(
      `/${this.role}/attendances`,
      {
        year: year,
        month: month,
      },
      this.headers,
    );

    return this.errorHandler(response);
  }

  public async myStat() {
    const response = await GET<AttendanceStats>(
      `${this.role}/attendances/statistics`,
    );

    return this.errorHandler(response);
  }

  public async lastLog() {
    const response = await GET<AttendanceLog | undefined>(
      `${this.role}/attendances/latest`,
    );
    return this.errorHandler(response);
  }

  public async checkin() {
    const response = await GET<AttendanceLog | undefined>(
      `${this.role}/attendances/checkin`,
    );
    return this.errorHandler(response);
  }

  public async checkout() {
    const response = await GET<AttendanceLog | undefined>(
      `${this.role}/attendances/checkout`,
    );
    return this.errorHandler(response);
  }
}

export default AttendanceLogService;
