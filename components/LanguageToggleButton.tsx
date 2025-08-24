import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Languages } from "@/lib/icons/icons";
import React from "react";

export function LanguageToggleButton() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant={"outline"}
      onPress={() => {
        setLanguage(language == "en" ? "ar" : "en");
      }}
      size={"icon"}
    >
      <Languages className="text-primary" />
    </Button>
  );
}
