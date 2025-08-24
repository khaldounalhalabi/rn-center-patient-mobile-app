import { useTranslation } from "@/localization";

const TranslatableEnum = ({ value }: { value?: string }) => {
  const { t } = useTranslation();
  if (!value) {
    return "";
  }
  return t(`types_statuses.${value}` as any);
};

export default TranslatableEnum;

export const useTranslateEnum = () => {
  const { t } = useTranslation();

  const translateEnum = (value?: string) => {
    if (!value) {
      return "";
    }
    return t(`types_statuses.${value}` as any);
  };

  return translateEnum;
};
