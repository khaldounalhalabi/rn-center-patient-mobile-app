import { GET } from "@/http/Http";
import DBNotification from "@/models/Notification";
import { BaseService } from "./BaseService";

export class NotificationService extends BaseService<
  NotificationService,
  DBNotification
>() {
  public getBaseUrl(): string {
    return `${this.role}/notifications`;
  }

  public async markAsRead(notificationId: string | number) {
    const response = await GET<boolean>(
      `${this.baseUrl}/${notificationId}/read`,
    );

    return this.errorHandler(response);
  }

  public async unreadCount() {
    return this.errorHandler(
      await GET<{
        unread_count: number;
      }>(`${this.baseUrl}/unread-count`),
    );
  }

  public async markAllAsRead() {
    return this.errorHandler(
      await GET<{
        marked: number;
      }>(`${this.baseUrl}/read-all`),
    );
  }
}
