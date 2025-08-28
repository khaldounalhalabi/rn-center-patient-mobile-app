import LabelValue from "@/components/label-value";
import LoadingScreen from "@/components/LoadingScreen";
import LoadingSpinner from "@/components/LoadingSpinner";
import Page from "@/components/page";
import PrescriptionDetails from "@/components/prescriptions/PrescriptionDetails";
import TranslatableEnum from "@/components/TranslatableEnum";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { AppointmentStatusEnum } from "@/enums/AppointmentStatusEnum";
import { useTranslation } from "@/localization";
import { AppointmentService } from "@/services/AppointmentService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";

const Appointment = () => {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const router = useRouter();
  const appointmentId = id ? parseInt(id as string) : 0;
  const service = AppointmentService.make();
  const { data: appointment, isLoading } = useQuery({
    queryKey: [`appointment_${id}`],
    queryFn: async () => await service.show(appointmentId),
    select(data) {
      return data.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => service.cancel(appointmentId),
    onSuccess() {
      router.back();
    },
  });

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Page>
      <LabelValue
        label={t("admin.service.table.doctor_name")}
        value={appointment?.clinic?.user?.full_name}
      />

      <LabelValue
        label={t("common.dashboard.serviceName")}
        value={appointment?.service?.name}
      />
      <LabelValue
        label={t("common.prescription.appointment_date")}
        value={appointment?.date_time}
      />
      <LabelValue
        label={t("common.dashboard.status")}
        value={<TranslatableEnum value={appointment?.status} />}
      />
      <LabelValue
        label={t("common.appointment.table.sequence")}
        value={appointment?.appointment_sequence}
      />
      <LabelValue
        label={t("common.appointment.show.remaining_time")}
        value={appointment?.remaining_time}
      />
      <LabelValue
        label={t("common.appointment.show.note")}
        value={appointment?.note}
        col
      />

      <PrescriptionDetails prescription={appointment?.prescription} />

      {appointment?.status == AppointmentStatusEnum.PENDING && (
        <Button
          variant={"destructive"}
          onPress={() => {
            cancelMutation.mutate();
          }}
          className="flex-1 "
        >
          <Text style={{ fontSize: 12 }}>{t("components.cancel")}</Text>
          {cancelMutation.isPending && (
            <LoadingSpinner className="text-destructive-foreground" />
          )}
        </Button>
      )}
    </Page>
  );
};

export default Appointment;
