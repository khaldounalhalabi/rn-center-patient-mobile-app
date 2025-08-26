import Form from "@/components/form/Form";
import Datepicker from "@/components/inputs/datepicker";
import FormSelect from "@/components/inputs/FormSelect";
import LabelValue, { Label } from "@/components/label-value";
import LoadingScreen from "@/components/LoadingScreen";
import LoadingSpinner from "@/components/LoadingSpinner";
import Page from "@/components/page";
import TranslatableEnum from "@/components/TranslatableEnum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import useUser from "@/hooks/UserHook";
import { useTranslation } from "@/localization";
import { AppointmentService } from "@/services/AppointmentService";
import { ClinicsService } from "@/services/ClinicsService";
import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Modal, View } from "react-native";

const Clinic = () => {
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const clinicId = id ? parseInt(id as string) : 0;
  const service = ClinicsService.make();
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [datetime, setDatetime] = useState<Dayjs | undefined>(undefined);

  const { data: clinic, isLoading } = useQuery({
    queryKey: [`clinic_${id}`],
    queryFn: async () => await service.show(clinicId),
    select(data) {
      return data.data;
    },
  });

  const { data: availableTimes, isLoading: isLoadingAvailableTimes } = useQuery(
    {
      queryKey: ["available_times", clinicId, date?.format("YYYY-MM-DD")],
      queryFn: async () => {
        return await AppointmentService.make().getAvailableTimes(
          clinicId ?? 0,
          date?.format("YYYY-MM-DD") ?? "",
        );
      },
      enabled: !!clinicId && !!date,
      select(data) {
        return data.data;
      },
    },
  );

  console.log(availableTimes);

  const appointmentService = AppointmentService.make();
  const book = async () => {
    return await appointmentService.store({
      date_time: datetime?.format("YYYY-MM-DD HH:mm"),
    });
  };

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Page>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Card className="flex-1 justify-center items-center">
          <CardHeader>
            <CardTitle className="text-lg font-bold mb-4 text-center">
              <Text>{t("patient_app.book_an_appointment")}</Text>
            </CardTitle>
          </CardHeader>
          <CardContent className="rounded-lg p-6 w-5/6">
            <Form handleSubmit={book}>
              <Datepicker
                label={t("holidays.date")}
                onChange={(v) => {
                  setDate(v);
                }}
                defaultValue={date}
              />
              {isLoadingAvailableTimes || !availableTimes ? (
                <View className="flex-1 justify-center">
                  <LoadingSpinner className="text-primary" size={22} />
                </View>
              ) : (
                <FormSelect
                  label={t("common.appointment.create.time")}
                  options={availableTimes ?? []}
                  name="date_time"
                  onChange={(v) => {
                    setDatetime(dayjs(`${date.format("YYYY-MM-DD")} ${v}`));
                  }}
                />
              )}
            </Form>
          </CardContent>
        </Card>
      </Modal>
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

      <Button
        disabled={!user}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text>{t("patient_app.book_an_appointment")}</Text>
      </Button>
      <Button variant={"secondary"}>
        <Text>{t("patient_app.doctor_schedule")}</Text>
      </Button>
    </Page>
  );
};

export default Clinic;
