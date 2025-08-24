import { getNestedPropertyValue } from "@/helpers/helpers";
import { Dayjs } from "dayjs";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";
import { Label } from "../ui/label";
import { Text } from "../ui/text";
import Datepicker from "./datepicker";

interface Props {
  name: string;
  defaultValue?: string | Dayjs;
  label?: string;
  required?: boolean;
  onChange?: (date: Dayjs) => void;
}

const FormDatepicker = ({
  name,
  defaultValue,
  label,
  required,
  onChange,
}: Props) => {
  const {
    control,
    setValue,
    formState: { defaultValues, errors },
  } = useFormContext();

  defaultValue = defaultValue ?? getNestedPropertyValue(defaultValues, name);
  const validationError = getNestedPropertyValue(errors, `${name}.message`);

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(name, defaultValue);
    }
  }, [defaultValue, name, setValue]);

  return (
    <View className="w-full flex flex-col justify-start gap-2 min-w-full">
      <Label className="w-full">
        <Text>{label}</Text>
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange: rhfOnChange, value } }) => (
          <Datepicker
            defaultValue={value}
            onChange={(date) => {
              rhfOnChange(date);
              if (onChange) {
                onChange(date);
              }
            }}
          />
        )}
      />
      {validationError && (
        <Text className="text-destructive text-sm">{validationError}</Text>
      )}
    </View>
  );
};

export default FormDatepicker;
