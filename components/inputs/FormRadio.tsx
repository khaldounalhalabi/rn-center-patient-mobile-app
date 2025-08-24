import { getNestedPropertyValue } from "@/helpers/helpers";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioProps {
  name: string;
  options: RadioOption[];
  label?: string;
  className?: string;
  defaultChecked?: ((value: string) => boolean) | string;
}

const FormRadio: React.FC<RadioProps> = ({
  name,
  options,
  label,
  defaultChecked = undefined,
}) => {
  const {
    control,
    formState: { defaultValues },
    setValue,
  } = useFormContext();

  const defaultValue = getNestedPropertyValue(defaultValues, name);

  const df = options.map((option) => {
    if (defaultChecked) {
      if (typeof defaultChecked == "string") {
        return { ...option, checked: option.value == defaultChecked };
      } else {
        return { ...option, checked: defaultChecked(option.value) };
      }
    }
    return { ...option, checked: option.value == defaultValue };
  });

  useEffect(() => {
    options.forEach((option) => {
      if (defaultChecked) {
        if (typeof defaultChecked == "string") {
          if (option.value == defaultChecked) {
            setValue(name, option.value);
          }
        } else {
          if (defaultChecked(option.value)) {
            setValue(name, option.value);
          }
        }
      } else {
        if (option.value == defaultValue) {
          setValue(name, option.value);
        }
      }
    });
  }, [defaultValue, name, setValue]);
  return (
    <View className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <RadioGroup
            value={value}
            onValueChange={onChange}
            className="gap-5 flex flex-row flex-wrap w-full items-center"
          >
            {df.map((option, index) => (
              <RadioGroupItemWithLabel
                key={index}
                value={option.value}
                label={option.label}
                onLabelPress={onChange}
              />
            ))}
          </RadioGroup>
        )}
      />
    </View>
  );
};

export default FormRadio;

function RadioGroupItemWithLabel({
  value,
  onLabelPress,
  label,
}: {
  value: string;
  onLabelPress: () => void;
  label?: string;
}) {
  return (
    <View className={"flex flex-row gap-2 items-center"}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {label ?? value}
      </Label>
    </View>
  );
}
