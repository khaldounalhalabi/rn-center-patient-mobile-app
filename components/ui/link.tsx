import { cn } from "@/lib/utils";
import { i18n } from "@/localization";
import { Link as EXPOLink, LinkProps } from "expo-router";
import * as React from "react";

const LinkClassContext = React.createContext<string | undefined>(undefined);

export default function Link({ className, children, ...props }: LinkProps) {
  const linkClass = React.useContext(LinkClassContext);
  const locale = i18n.locale;
  return (
    <EXPOLink
      className={cn(
        "text-base text-foreground web:select-text",
        linkClass,
        className,
      )}
      style={{
        fontFamily: locale == "en" ? "kodchasan" : "cairo",
      }}
      {...props}
    >
      {children}
    </EXPOLink>
  );
}
