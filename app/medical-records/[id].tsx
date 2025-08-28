import LabelValue from "@/components/label-value";
import LoadingScreen from "@/components/LoadingScreen";
import Page from "@/components/page";
import { useTranslation } from "@/localization";
import MedicalRecordService from "@/services/MedicalRecordService";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

const Prescription = () => {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const service = MedicalRecordService.make();
  const { data: record, isLoading } = useQuery({
    queryKey: [`medical_record_${id}`],
    queryFn: () => service.show(parseInt(id as string)),
    select(data) {
      return data.data;
    },
  });

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Page>
      <LabelValue
        label={t("medical_records.summary")}
        value={record?.summary}
        col
      />
      <LabelValue
        label={t("medical_records.diagnosis")}
        value={record?.diagnosis}
        col
      />
      <LabelValue
        label={t("medical_records.treatment")}
        value={record?.treatment}
        col
      />
      <LabelValue
        label={t("medical_records.allergies")}
        value={record?.allergies}
        col
      />
      <LabelValue
        label={t("medical_records.notes")}
        value={record?.notes}
        col
      />
      <LabelValue
        label={t("landing.doctor_name")}
        value={record?.clinic?.user?.full_name}
      />
      <LabelValue label={t("tasks.issued_at")} value={record?.created_at} />
    </Page>
  );
};

export default Prescription;
