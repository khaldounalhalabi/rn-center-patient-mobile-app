import Form from "@/components/form/Form";
import Datepicker from "@/components/inputs/datepicker";
import FormSelect from "@/components/inputs/FormSelect";
import LabelValue, { Label } from "@/components/label-value";
import LoadingScreen from "@/components/LoadingScreen";
import LoadingSpinner from "@/components/LoadingSpinner";
import Page from "@/components/page";
import { toast } from "@/components/toast/toast";
import TranslatableEnum from "@/components/TranslatableEnum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import useUser from "@/hooks/UserHook";
import { useTranslation } from "@/localization";
import { AppointmentService } from "@/services/AppointmentService";
import { ClinicsService } from "@/services/ClinicsService";
import { HolidayService } from "@/services/HolidayService";
import VacationService from "@/services/VacationService";
import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

const Clinic = () => {
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const clinicId = id ? parseInt(id as string) : 0;
  const service = ClinicsService.make();
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [datetime, setDatetime] = useState<Dayjs | undefined>(undefined);

  function getDaysBetween(start: Dayjs, end: Dayjs): Dayjs[] {
    const days: Dayjs[] = [];
    let current = start.startOf("day");

    while (current.isBefore(end) || current.isSame(end, "day")) {
      days.push(current);
      current = current.add(1, "day");
    }

    return days;
  }

  const holidayService = HolidayService.make();
  const { data: holidays, isLoading: loadingHolidays } = useQuery({
    queryKey: ["holidays_data"],
    queryFn: async () => await holidayService.activeHolidays(),
    select(data) {
      let dates: Dayjs[] = [];
      data.data?.forEach((h) => {
        const between = getDaysBetween(dayjs(h.from), dayjs(h.from));
        dates = [...dates, ...between];
      });
      return dates;
    },
    enabled: user !== undefined && user != null,
  });

  const vacationService = VacationService.make();
  const { data: vacations, isLoading: loadingVacations } = useQuery({
    queryKey: ["vacations_data"],
    queryFn: async () => await vacationService.activeByClinic(clinicId),
    enabled: user !== undefined && user != null,
    select(data) {
      let dates: Dayjs[] = [];
      data.data?.forEach((v) => {
        const between = getDaysBetween(dayjs(v.from), dayjs(v.from));
        dates = [...dates, ...between];
      });
      return dates;
    },
  });

  const { data: clinic, isLoading } = useQuery({
    queryKey: [`clinic_${id}`],
    queryFn: async () => await service.show(clinicId),
    select(data) {
      return data.data;
    },
  });

  const appointmentService = AppointmentService.make();
  const { data: availableTimes, isLoading: isLoadingAvailableTimes } = useQuery(
    {
      queryKey: ["available_times", clinicId, date?.format("YYYY-MM-DD")],
      queryFn: async () => {
        return await appointmentService.getAvailableTimes(
          clinicId ?? 0,
          date?.format("YYYY-MM-DD") ?? "",
        );
      },
      enabled: !!clinicId && !!date,
      select(data) {
        return data.data ?? [];
      },
    },
  );

  const book = async () => {
    const response = await appointmentService.store({
      date_time: datetime?.format("YYYY-MM-DD HH:mm"),
      clinic_id: clinicId,
    });

    if (!response.ok() && !response.hasValidationErrors()) {
      toast.error(response.message as string);
    }

    return response;
  };

  const onBookSuccess = () => {
    setModalVisible(false);
    router.replace("/clinics");
  };

  return isLoading || loadingHolidays || loadingVacations ? (
    <LoadingScreen />
  ) : (
    <Page>
      <LabelValue
        label={t("details.first-Name")}
        value={clinic?.user?.first_name}
      />

      <LabelValue
        label={t("details.last-name")}
        value={clinic?.user?.last_name}
      />

      <LabelValue
        label={t("details.gender")}
        value={<TranslatableEnum value={clinic?.user?.gender} />}
      />
      <LabelValue
        label={t("common.appointment.create.clinic_appointment_cost")}
        value={clinic?.appointment_cost}
      />

      <LabelValue
        label={t("admin.clinic.show.maxAppointmentsPerDay")}
        value={clinic?.max_appointments}
      />
      <LabelValue
        label={t("admin.clinic.show.experienceY")}
        value={clinic?.experience_years}
      />

      <Label label={t("landing.specialities") + " :"} className="gap-3" col>
        <View className="w-full flex-row items-center gap-2">
          {(clinic?.specialities?.length ?? 0) <= 0 && (
            <Badge>
              <Text>{t("components.no_data")}</Text>
            </Badge>
          )}
          {clinic?.specialities?.map((s, i) => (
            <Badge key={i}>
              <Text>{s.name}</Text>
            </Badge>
          ))}
        </View>
      </Label>

      <Dialog open={modalVisible} onOpenChange={setModalVisible}>
        <DialogTrigger asChild>
          <Button disabled={!user}>
            <Text>{t("patient_app.book_an_appointment")}</Text>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Text>{t("patient_app.book_an_appointment")}</Text>
            </DialogTitle>
          </DialogHeader>
          <Form handleSubmit={book} onSuccess={onBookSuccess}>
            <Datepicker
              label={t("holidays.date")}
              onChange={(v) => {
                setDate(v);
              }}
              minDate={dayjs()}
              defaultValue={date}
              disabledDates={[
                ...(vacations?.map((v) => v.format("YYYY-MM-DD")) ?? []),
                ...(holidays?.map((h) => h.format("YYYY-MM-DD")) ?? []),
              ]}
            />
            {isLoadingAvailableTimes || !availableTimes ? (
              <View className="flex flex-row justify-center items-center w-full">
                <LoadingSpinner className="text-primary" size={22} />
              </View>
            ) : (
              <FormSelect
                label={t("common.appointment.create.time")}
                options={
                  availableTimes?.length === 0
                    ? [t("components.no_data")]
                    : availableTimes
                }
                name="date_time"
                onChange={(v) => {
                  setDatetime(dayjs(`${date.format("YYYY-MM-DD")} ${v}`));
                }}
              />
            )}
          </Form>
        </DialogContent>
      </Dialog>

      <Button variant={"secondary"}>
        <Text>{t("patient_app.doctor_schedule")}</Text>
      </Button>
    </Page>
  );
};

export default Clinic;
