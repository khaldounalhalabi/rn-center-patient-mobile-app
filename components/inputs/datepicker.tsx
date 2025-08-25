import { useTranslation } from "@/localization";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { Label } from "../ui/label";
import { Text } from "../ui/text";

const Datepicker = ({
  defaultValue,
  onChange,
  label,
}: {
  defaultValue?: string | Dayjs;
  onChange?: (date: Dayjs) => void;
  label?: string;
}) => {
  const [date, setDate] = useState<Dayjs | undefined>(
    defaultValue ? dayjs(defaultValue) : undefined,
  );
  const { t } = useTranslation();
  const open = () => {
    if (Platform.OS == "android") {
      DateTimePickerAndroid.open({
        value: defaultValue ? dayjs(defaultValue).toDate() : dayjs().toDate(),
        onChange(event, date) {
          if (onChange) {
            onChange(dayjs(date));
          }

          setDate(dayjs(date));
        },
        mode: "date",
      });
    }
  };

  return (
    <>
      <Pressable onPress={open} className="w-full">
        <Label>{label}</Label>
        <View className="w-full p-3 border border-muted rounded-md">
          <Text>
            {date?.format("YYYY-MM-DD") ?? t("components.datepicker")}
          </Text>
        </View>
      </Pressable>
    </>
  );
};

export default Datepicker;
