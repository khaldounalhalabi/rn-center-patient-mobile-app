import { getNestedPropertyValue } from "@/helpers/helpers";
import { i18n } from "@/localization";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";
import { Label } from "../ui/label";
import { Text } from "../ui/text";
import { Textarea } from "../ui/textarea";

interface Props {
  name: string;
  defaultValue?: string;
  label?: string;
  required?: boolean;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  numberOfLines?: number;
  minHeight?: number;
}

const FormTextarea = ({
  name,
  defaultValue,
  label,
  required,
  onChangeText,
  placeholder = "",
  numberOfLines = 4,
  minHeight = 80,
}: Props) => {
  const {
    control,
    setValue,
    formState: { defaultValues, errors },
  } = useFormContext();
  const locale = i18n.locale;

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
        render={({ field: { onChange, onBlur, value } }) => (
          <Textarea
            value={value}
            onChangeText={(v) => {
              onChange(v);
              if (onChangeText) onChangeText(v);
            }}
            onBlur={onBlur}
            placeholder={placeholder}
            numberOfLines={numberOfLines}
            style={{
              minHeight,
              fontFamily: locale == "en" ? "kodchasan" : "cairo",
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

export default FormTextarea;
