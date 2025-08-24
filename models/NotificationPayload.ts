import { getNestedPropertyValue } from "@/helpers/helpers";
import { i18n } from "@/localization";
import { Href } from "expo-router";

export class NotificationPayload {
  private message_en: string = "";
  private message_ar: string = "";
  private resource_id: string | number = 0;
  private resource_type: string = "";
  private notification_title: string = "";
  private notification_type: NotificationsTypeEnum;
  private data: Record<string, any> = {};

  constructor(data: Record<string, any>) {
    this.data = data;
    this.message_ar = data?.message_ar ?? "";
    this.message_en = data?.message_en ?? "";
    this.resource_id = data?.resource_id ?? 0;
    this.resource_type = data?.resource ?? "";
    this.notification_type = data?.type ?? "";
    this.notification_title = data?.title;
  }

  public get messageEn(): string {
    return this.message_en;
  }

  public get messageAr(): string {
    return this.message_ar;
  }

  public get resourceId(): string | number {
    return this.resource_id;
  }

  public get resource(): string {
    return this.resource_type;
  }

  public get title(): string {
    return this.notification_title;
  }

  public get type(): NotificationsTypeEnum | RealTimeEventsTypeEnum {
    return this.notification_type;
  }

  public getData(key?: string) {
    if (!key) {
      return this.data;
    }
    return getNestedPropertyValue(this.data, key);
  }

  public isNotification() {
    if (this.type != undefined) {
      return (Object.values(NotificationsTypeEnum) as Array<string>).includes(
        String(this.type),
      );
    } else {
      return false;
    }
  }

  public isRealTimeEvent() {
    if (this.type != undefined) {
      return (Object.values(RealTimeEventsTypeEnum) as Array<string>).includes(
        this.type as string,
      );
    } else {
      return false;
    }
  }

  public get message(): string {
    const locale = i18n.locale;
    if (locale == "ar") {
      return this.messageAr;
    } else {
      return this.messageEn;
    }
  }

  public getUrl(): Href {
    const type = this.type;
    switch (type) {
      case NotificationsTypeEnum.AppointmentEvent:
        if (this.getData("event") != "DELETED") {
          return {
            pathname: "/appointments/[id]",
            params: {
              id: this.getData("appointment_id"),
            },
          };
        } else {
          return "/appointments";
        }

      case NotificationsTypeEnum.NewPayrunAdded:
        return `/payslips`;
      case NotificationsTypeEnum.PayslipUpdated:
        return {
          pathname: "/payslips/[id]",
          params: {
            id: this.getData("payslip_id"),
          },
        };
      case NotificationsTypeEnum.NewVacationAdded:
        return `/vacations`;
      case NotificationsTypeEnum.VacationStatusChanged:
        return `/vacations`;
      case NotificationsTypeEnum.VacationUpdated:
        return `/vacations`;
      case NotificationsTypeEnum.NewTaskComment:
        return `/tasks`;
      case NotificationsTypeEnum.TaskStatusChanged:
        return `/tasks`;
      case NotificationsTypeEnum.NewTaskAssigned:
        return `/tasks`;

      default:
        return "/";
    }
  }
}

export enum NotificationsTypeEnum {
  // Common
  AppointmentEvent = "Common\\AppointmentEventNotification",

  NewVacationAdded = "Common\\NewVacationAddedNotification",
  VacationStatusChanged = "Common\\VacationStatusChangedNotification",
  VacationUpdated = "Common\\VacationUpdatedNotification",

  NewPayrunAdded = "Common\\NewPayrunAddedNotification",
  PayslipUpdated = "Common\\PayslipUpdatedNotification",

  NewTaskComment = "Common\\NewCommentOnTaskNotification",
  TaskStatusChanged = "Common\\TaskStatusChangedNotification",

  //Secretary
  NewTaskAssigned = "Secretary\\NewTaskAssignedNotification",
}

export enum RealTimeEventsTypeEnum {
  AttendanceEdited = "Realtime\\AttendanceEditedNotification",
  PayrunStatusChanged = "Realtime\\PayrunStatusChangedNotification",
}
