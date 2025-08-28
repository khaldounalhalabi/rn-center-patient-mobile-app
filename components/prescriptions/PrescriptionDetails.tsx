import { useTranslation } from "@/localization";
import { Prescription } from "@/models/Prescriptions";
import LabelValue, { Label } from "../label-value";
import TranslatableEnum from "../TranslatableEnum";

const PrescriptionDetails = ({
  prescription,
}: {
  prescription: Prescription | undefined;
}) => {
  const { t } = useTranslation();
  return (
    <>
      <LabelValue
        label={t("common.prescription.next_visit")}
        value={prescription?.next_visit}
      />

      <LabelValue
        label={t("common.prescription.prescribed_at")}
        value={prescription?.created_at}
      />

      {prescription?.other_data?.map((item, index) => (
        <LabelValue key={index} label={item.key} value={item.value} col />
      ))}

      {(prescription?.medicines?.length ?? 0) > 0 && (
        <Label label={t("links.medicines")} col>
          {prescription?.medicines?.map((med, index) => (
            <Label
              label={med.medicine?.name}
              col
              className="border my-2 border-primary rounded-md p-3"
              key={index}
            >
              <LabelValue
                label={t("common.prescription.dosage")}
                value={med.dosage}
              />
              <LabelValue
                label={t("common.prescription.dosage_interval")}
                value={med.dose_interval}
              />

              <LabelValue label={t("tasks.user_comment")} value={med.comment} />

              <LabelValue
                label={t("tasks.status")}
                value={<TranslatableEnum value={med.status} />}
              />
            </Label>
          ))}
        </Label>
      )}
    </>
  );
};

export default PrescriptionDetails;
