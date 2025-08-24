import { cn } from "@/lib/utils";
import { i18n } from "@/localization";
import * as LabelPrimitive from "@rn-primitives/label";
import * as React from "react";

function Label({
  className,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  ...props
}: LabelPrimitive.TextProps & {
  ref?: React.RefObject<LabelPrimitive.TextRef>;
}) {
  const locale = i18n.locale;
  return (
    <LabelPrimitive.Root
      className="web:cursor-default"
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <LabelPrimitive.Text
        className={cn(
          "text-sm text-foreground native:text-base font-medium leading-none web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70",
          className,
        )}
        style={{ fontFamily: locale == "en" ? "kodchasan" : "cairo" }}
        {...props}
      />
    </LabelPrimitive.Root>
  );
}

export { Label };
