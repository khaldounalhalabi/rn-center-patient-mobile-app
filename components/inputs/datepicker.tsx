import { useTranslation } from "@/localization";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { Modal, Pressable, useColorScheme, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Text } from "../ui/text";

const Datepicker = ({
  defaultValue,
  onChange,
  label,
  disabledDates = [],
  minDate = undefined,
}: {
  defaultValue?: string | Dayjs;
  onChange?: (date: Dayjs) => void;
  label?: string;
  disabledDates?: string[];
  minDate?: Dayjs | string;
}) => {
  const colorScheme = useColorScheme();
  const [date, setDate] = useState<Dayjs | undefined>(
    defaultValue ? dayjs(defaultValue) : undefined,
  );
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const handleSelect = (day: { dateString: string }) => {
    const selected = dayjs(day.dateString);
    setDate(selected);
    if (onChange) {
      onChange(selected);
    }
    setVisible(false);
  };

  let shouldDisabled:
    | {
        [date: string]: { disabled: boolean; disableTouchEvent: boolean };
      }
    | any = {};

  disabledDates.forEach((date) => {
    shouldDisabled[date] = { disabled: true, disableTouchEvent: true };
  });

  return (
    <>
      <Pressable onPress={() => setVisible(true)} className="w-full">
        <Label>{label}</Label>
        <View className="w-full p-3 border border-muted rounded-md">
          <Text>
            {date?.format("YYYY-MM-DD") ?? t("components.datepicker")}
          </Text>
        </View>
      </Pressable>

      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 justify-center bg-black/50">
          <View className=" rounded-2xl mx-4 p-4">
            <Calendar
              minDate={
                minDate ? dayjs(minDate).format("YYYY-MM-DD") : undefined
              }
              onDayPress={handleSelect}
              markedDates={shouldDisabled}
              theme={{
                backgroundColor: colorScheme === "dark" ? "#171717" : "#ffffff",
                calendarBackground:
                  colorScheme === "dark" ? "#171717" : "#ffffff",
                dayTextColor: colorScheme === "dark" ? "#f5f5f5" : "#111827",
                monthTextColor: colorScheme === "dark" ? "#f5f5f5" : "#111827",
                textSectionTitleColor:
                  colorScheme === "dark" ? "#a3a3a3" : "#6b7280",
                selectedDayBackgroundColor: "#2563eb",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#22c55e",
                arrowColor: colorScheme === "dark" ? "#f5f5f5" : "#111827",
                textDisabledColor:
                  colorScheme === "dark" ? "#525252" : "#d1d5db",
              }}
              style={{
                borderRadius: 12,
                backgroundColor: colorScheme === "dark" ? "#171717" : "#ffffff",
              }}
            />

            <Button
              onPress={() => setVisible(false)}
              className="mt-4 p-3 bg-gray-200 rounded-lg items-center"
            >
              <Text>{t("tasks.cancel")}</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Datepicker;
