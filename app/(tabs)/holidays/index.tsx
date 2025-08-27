import Datepicker from "@/components/inputs/datepicker";
import LabelValue from "@/components/label-value";
import useListPage from "@/components/ListPage";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/localization";
import { Holiday } from "@/models/Holiday";
import { HolidayService } from "@/services/HolidayService";
import React from "react";
import { View } from "react-native";

interface HolidayCardProps {
  item: Holiday;
}

const HolidayCard = ({ item }: HolidayCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-4 flex-row items-stretch overflow-hidden">
      <View className="w-1.5 rounded-l-lg bg-primary" />
      <CardContent className="flex-1 p-4">
        <LabelValue label={t("holidays.from")} value={item.from} />
        <LabelValue label={t("holidays.to")} value={item.to} />
        <LabelValue label={t("holidays.reason")} value={item.reason} col />
      </CardContent>
    </Card>
  );
};

const Holidays = () => {
  const service = HolidayService.make();
  const { t } = useTranslation();
  const { Render } = useListPage<Holiday>({
    queryKey: "holidays",
    api(page, search, params) {
      return service.indexWithPagination(
        page,
        search,
        undefined,
        undefined,
        undefined,
        params,
      );
    },
    renderItem: ({ item }) => <HolidayCard item={item} />,
    filter(params, setParam) {
      return (
        <Datepicker
          label={t("holidays.date")}
          onChange={(date) => {
            setParam("date", date.format("YYYY-MM-DD"));
          }}
          defaultValue={params?.date}
        />
      );
    },
  });

  return <Render />;
};

export default Holidays;
