import { useTranslateEnum } from "@/components/TranslatableEnum";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { TextProps, View, ViewProps } from "react-native";
import { Text } from "./ui/text";

const LabelValue = ({
  label,
  value,
  className,
  separated = true,
  col = false,
}: {
  label?: string;
  value?: string | number | ReactNode;
  className?: string;
  separated?: boolean;
  col?: boolean;
}) => {
  return (
    <View
      className={cn(
        `flex ${col ? "flex-col items-start" : "flex-row items-center"}  ${separated ? "justify-between" : ""} w-full`,
        className,
      )}
    >
      <Text className="font-bold">
        {label} {!separated ? ": " : ""}
      </Text>
      <View>
        <Text className="font-thin">
          <Value value={value} />
        </Text>
      </View>
    </View>
  );
};

export default LabelValue;

interface LabelProps extends ViewProps {
  label?: string | any;
  children?: ReactNode;
  col?: boolean;
  separated?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  label,
  children,
  className,
  col = false,
  separated = true,
  ...props
}) => {
  return (
    <View
      className={cn(
        `flex ${col ? "flex-col items-start" : "flex-row items-center"}  ${separated ? "justify-between" : ""} w-full`,
        className,
      )}
      {...props}
    >
      <Text className="font-bold">
        {label} {!separated ? ": " : ""}
      </Text>
      <View>{children}</View>
    </View>
  );
};

interface ValueProps extends TextProps {
  value?: any;
  children?: ReactNode;
}

export const Value: React.FC<ValueProps> = ({
  value,
  children,
  className,
  ...props
}) => {
  let showedValue = value;
  const tEnum = useTranslateEnum();
  if (value === undefined || value === null) {
    showedValue = tEnum("no_data");
  } else if (value === 0 || Number.isNaN(value)) {
    showedValue = 0;
  } else if (value === false) {
    showedValue = "false";
  } else if (value === "") {
    showedValue = tEnum("no_data");
  } else if (
    typeof value == "string" &&
    (value?.includes("undefined") || value?.includes("null"))
  ) {
    showedValue = tEnum("no_data");
  } else if (typeof value == "string" && value.includes("NaN")) {
    showedValue = 0;
  }

  return (
    <Text
      className={className ?? `text-start text-xs font-normal md:text-base`}
      {...props}
    >
      {!children ? showedValue : children}
    </Text>
  );
};
