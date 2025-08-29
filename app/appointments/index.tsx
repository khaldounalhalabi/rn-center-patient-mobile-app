import Datepicker from "@/components/inputs/datepicker";
import Select from "@/components/inputs/Select";
import useListPage from "@/components/ListPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "@/components/toast/toast";
import TranslatableEnum from "@/components/TranslatableEnum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { AppointmentStatusEnum } from "@/enums/AppointmentStatusEnum";
import { getEnumValues } from "@/helpers/helpers";
import { useNotificationHandler } from "@/hooks/NotificationHandlerHook";
import { CalendarIcon } from "@/lib/icons/icons";
import type { TranslationKey } from "@/localization";
import { useTranslation } from "@/localization";
import { Appointment } from "@/models/Appointment";
import {
  NotificationPayload,
  NotificationsTypeEnum,
} from "@/models/NotificationPayload";
import { AppointmentService } from "@/services/AppointmentService";
import dayjs from "dayjs";
import * as Calendar from "expo-calendar";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Linking, Pressable, View } from "react-native";
async function requestCalendarPermissions() {
  const { status, canAskAgain } = await Calendar.getCalendarPermissionsAsync();

  if (status === "granted") return true;

  if (!canAskAgain) {
    alert("Please enable calendar access in settings.");
    await Linking.openSettings();
    return false;
  }

  const { status: newStatus } =
    await Calendar.requestCalendarPermissionsAsync();
  return newStatus === "granted";
}

interface AppointmentCardProps {
  item: any;
  t: (key: TranslationKey, options?: any) => string;
  router: ReturnType<typeof useRouter>;
}

async function getDefaultCalendarId() {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT,
  );
  const defaultCalendar = calendars.find(
    (cal) => cal.source && cal.source.name === "Default",
  );
  return defaultCalendar?.id || calendars[0]?.id;
}

async function eventExists(
  calendarId: string,
  title: string,
  startDate: Date,
  endDate: Date,
) {
  const events = await Calendar.getEventsAsync(
    [calendarId],
    startDate,
    endDate,
  );

  return events.some(
    (event) =>
      event.title === title &&
      new Date(event.startDate).getTime() === startDate.getTime(),
  );
}

async function addEventToCalendar(appointment: Appointment) {
  const hasPermission = await requestCalendarPermissions();
  if (!hasPermission) return;

  const calendarId = await getDefaultCalendarId();

  const startDate = dayjs(appointment.date_time).toDate();
  const endDate = dayjs(appointment.date_time).toDate();
  const title = `Appointment with ${appointment.clinic?.user?.full_name}`;

  if (await eventExists(calendarId, title, startDate, endDate)) {
    toast.success("Success");
    return;
  }

  await Calendar.createEventAsync(calendarId, {
    title: title,
    startDate: startDate,
    endDate: endDate,
    notes: `Appointment with ${appointment.clinic?.user?.full_name}`,
  });

  toast.success("Success");
}

const AppointmentCard = ({ item, t, router }: AppointmentCardProps) => {
  const [loading, setLoading] = useState(false);
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: `/appointments/[id]`,
          params: { id: item.id },
        });
      }}
      className="mb-4 flex-row items-stretch overflow-hidden"
    >
      {/* Accent bar */}
      <View className="w-1.5 bg-primary rounded-l-lg" />
      <Card className="flex-1 p-0 bg-card shadow-sm">
        <CardHeader>
          <View className="flex-row justify-between items-center mb-1">
            <Text className="font-bold text-lg text-card-foreground">
              {item.clinic?.user?.full_name}
            </Text>
            <Badge variant="secondary">
              <Text className="text-card-foreground">{item.date_time}</Text>
            </Badge>
          </View>
          <Badge variant="outline" className="self-start mt-1">
            <Text className="font-bold text-primary">
              <TranslatableEnum value={item.status} />
            </Text>
          </Badge>
        </CardHeader>
        <CardContent>
          <View className="mt-2">
            <View className="flex-row justify-between mb-1">
              <Text className="text-muted-foreground">
                {t("common.dashboard.sequence")}
              </Text>
              <Text className="font-semibold text-card-foreground">
                {item.appointment_sequence}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">
                {t("common.dashboard.serviceName")}
              </Text>
              <Text className="font-semibold text-card-foreground">
                {item.service?.name}
              </Text>
            </View>
            <Button
              onPress={async () => {
                setLoading(true);
                await addEventToCalendar(item);
                setLoading(false);
              }}
              className={"mt-2"}
            >
              {loading ? (
                <LoadingSpinner
                  className={"text-primary-foreground"}
                  size={16}
                />
              ) : (
                <View className={"flex flex-row items-center gap-3"}>
                  <Text>{t("components.add_to_calendar")}</Text>
                  <CalendarIcon
                    className={"text-primary-foreground"}
                    size={16}
                  />
                </View>
              )}
            </Button>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
};

const Appointments = () => {
  const service = AppointmentService.make();
  const { t } = useTranslation();
  const router = useRouter();
  const { Render, refetch } = useListPage({
    queryKey: "appointments",
    api(page, search, params) {
      return service.indexWithPagination(
        page,
        search,
        undefined,
        undefined,
        undefined,
        params,
      );
    },
    renderItem: ({ item }) => (
      <AppointmentCard item={item} t={t} router={router} />
    ),
    filter(params, setParam) {
      return (
        <>
          <Select
            label={t("common.appointment.table.status")}
            onChange={(v) => setParam("status", v)}
            data={getEnumValues(AppointmentStatusEnum)}
            selected={params?.status}
            translated
          />
          <Datepicker
            label={t("common.appointment.show.date")}
            onChange={(date) => {
              setParam("date", date.format("YYYY-MM-DD"));
            }}
            defaultValue={params?.date}
          />
        </>
      );
    },
  });

  const handleNotification = useCallback((payload: NotificationPayload) => {
    if (payload.type === NotificationsTypeEnum.AppointmentEvent) {
      refetch();
    }
  }, [refetch]);

  useNotificationHandler({
    handle: handleNotification,
  });

  return <Render />;
};

export default Appointments;
