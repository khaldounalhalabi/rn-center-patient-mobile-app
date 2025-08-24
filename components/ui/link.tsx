import { cn } from "@/lib/utils";
import { Link as EXPOLink, LinkProps } from "expo-router";
import * as React from "react";

const LinkClassContext = React.createContext<string | undefined>(undefined);

export default function Link({ className, children, ...props }: LinkProps) {
  const linkClass = React.useContext(LinkClassContext);
  return (
    <EXPOLink
      className={cn(
        "text-base text-foreground web:select-text",
        linkClass,
        className,
      )}
      {...props}
    >
      {children}
    </EXPOLink>
  );
}
