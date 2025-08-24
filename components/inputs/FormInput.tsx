import { getNestedPropertyValue } from "@/helpers/helpers";
import { useTranslation } from "@/localization";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextInputProps, View } from "react-native";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Text } from "../ui/text";
interface Props extends TextInputProps {
  name: string;
  defaultValue?: string | undefined;
  label?: string;
  required?: boolean;
  onChangeText?: (value: string) => void;
  type:
    | "text"
    | "tel"
    | "month"
    | "email"
    | "password"
    | "number"
    | "url"
    | "year";
}
const FormInput = ({
  name,
  defaultValue,
  label,
  required,
  onChangeText,
  type,
  secureTextEntry = false,
  returnKeyType = undefined,
  textContentType = undefined,
  ...props
}: Props) => {
  const {
    control,
    setValue,
    formState: { defaultValues, errors },
  } = useFormContext();

  const { t } = useTranslation();
  const eg = t("components.eg");
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
          <Input
            onBlur={onBlur}
            onChangeText={(v) => {
              onChange(v);
              if (onChangeText) {
                onChangeText(v);
              }
            }}
            value={value}
            placeholder={getPlaceholder(type, label ?? "", eg)}
            {...props}
            secureTextEntry={secureTextEntry || type == "password"}
            keyboardType={type == "tel" ? "phone-pad" : "default"}
            returnKeyType={returnKeyType ?? "next"}
            textContentType={
              type == "tel" ? "telephoneNumber" : textContentType
            }
          />
        )}
      />
      {validationError && (
        <Text className="text-destructive text-sm">{validationError}</Text>
      )}
    </View>
  );
};

export default FormInput;

const getPlaceholder = (type: string, label: string, eg: string) => {
  if (type == "text") {
    return `${label} ...`;
  } else if (type == "tel") {
    return `${label} (${eg}: 0912345678)`;
  } else if (type == "month") {
    return `${label} (${eg}: September)`;
  } else if (type == "email") {
    return `${label} (${eg}: example@email.com)`;
  } else if (type == "password") {
    return `${label} (${eg}: P@$$w0rd)`;
  } else if (type == "number") {
    return `${label} (${eg}: 10)`;
  } else if (type == "url") {
    return `${label} (${eg}: https://www.google.com)`;
  } else if (type == "year") {
    return `${label} (${eg}: 1990)`;
  } else {
    return `${label} ...`;
  }
};
