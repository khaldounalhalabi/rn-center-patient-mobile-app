import { getNestedPropertyValue } from "@/helpers/helpers";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";
import { Text } from "../ui/text";
import Select from "./Select";

interface Props {
  name: string;
  options: any[];
  defaultValue?: string | undefined;
  label?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const FormSelect = ({
  name,
  options,
  defaultValue,
  label,
  required,
  placeholder,
  onChange,
  disabled = false,
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
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange: fieldOnChange, value } }) => (
          <Select
            data={options}
            selected={defaultValue}
            label={label}
            onChange={(selectedValue) => {
              fieldOnChange(selectedValue);
              if (onChange) {
                onChange(selectedValue);
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

export default FormSelect;
