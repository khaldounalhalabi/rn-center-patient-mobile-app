import { cn } from "@/lib/utils";
import { i18n } from "@/localization";
import * as Slot from "@rn-primitives/slot";
import * as React from "react";
import { Text as RNText } from "react-native";

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<typeof RNText> & {
  ref?: React.RefObject<RNText>;
  asChild?: boolean;
}) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  const locale = i18n.locale;
  return (
    <Component
      className={cn(
        "text-base text-foreground web:select-text font-system",
        textClass,
        className,
      )}
      style={{
        fontFamily: locale == "en" ? "kodchasan" : "cairo",
      }}
      {...props}
    />
  );
}

export { Text, TextClassContext };
