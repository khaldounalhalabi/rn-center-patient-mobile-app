import { SlidersHorizontal } from "@/lib/icons/icons";
import { useTranslation } from "@/localization";
import React, { useState } from "react";
import { View } from "react-native";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Text } from "./ui/text";

const useFilter = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [params, setParams] = useState<undefined | Record<string, any>>({});
  const [tempParams, setTempParams] = useState<Record<string, any>>({});

  const setParam = (key: string, value: any) => {
    setTempParams((prev) => {
      let temp = prev;
      temp[key] = value;
      return temp;
    });
  };

  const confirm = () => {
    setParams(tempParams);
    setOpen(false);
  };

  const clear = () => {
    setParams(undefined);
    setOpen(false);
  };

  const Filter = ({ children }: { children?: React.ReactNode }) => {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"default"} size={"icon"}>
            <SlidersHorizontal className="text-background" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Text>{t("table.filters")}</Text>
            </DialogTitle>
          </DialogHeader>
          <View className="w-full flex flex-col items-start gap-3">
            {children}
          </View>
          <DialogFooter className="mt-3 flex flex-row items-center justify-end">
            <Button onPress={clear} variant={"destructive"} size={"sm"}>
              <Text>{t("table.resetFilters")}</Text>
            </Button>
            <Button onPress={confirm} size={"sm"}>
              <Text>{t("components.ok")}</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  return { params, setParam, Filter };
};

export default useFilter;
