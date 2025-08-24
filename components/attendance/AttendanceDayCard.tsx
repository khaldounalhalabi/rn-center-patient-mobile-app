import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import AttendanceLogStatusEnum from "@/enums/AttendanceLogStatusEnum";
import AttendanceLogTypeEnum from "@/enums/AttendanceLogTypeEnum";
import { useLanguage } from "@/hooks/useLanguage";
import { Calendar } from "@/lib/icons/icons";
import { useTranslation } from "@/localization";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import TranslatableEnum from "../TranslatableEnum";

interface AttendanceLog {
  id: number;
  attend_at: string;
  type: AttendanceLogTypeEnum;
  status: AttendanceLogStatusEnum;
}

interface Props {
  date: string;
  logs?: AttendanceLog[];
}

const getStatusVariant = (
  status: AttendanceLogStatusEnum,
): "default" | "destructive" | "secondary" | "outline" | undefined => {
  switch (status) {
    case AttendanceLogStatusEnum.ON_TIME:
      return "default";
    case AttendanceLogStatusEnum.LATE:
      return "destructive";
    case AttendanceLogStatusEnum.OVER_TIME:
      return "secondary";
    case AttendanceLogStatusEnum.EARLY_LEAVE:
      return "outline";
    default:
      return undefined;
  }
};

const getTypeColor = (type: AttendanceLogTypeEnum) =>
  type == AttendanceLogTypeEnum.CHECKIN ? "bg-green-500" : "bg-red-500";

const AttendanceDayCard: React.FC<Props> = ({ date, logs }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { language } = useLanguage();

  if (!logs) {
    logs = [];
  }

  const getStartEndTimes = () => {
    if (logs?.length === 0) return null;
    const sortedLogs = [...logs].sort(
      (a, b) => dayjs(a.attend_at).valueOf() - dayjs(b.attend_at).valueOf(),
    );
    const firstLog = sortedLogs[0];
    const lastLog = sortedLogs[sortedLogs.length - 1];
    return {
      start: dayjs(firstLog.attend_at).format("HH:mm"),
      end: dayjs(lastLog.attend_at).format("HH:mm"),
      totalHours: dayjs(lastLog.attend_at)
        .diff(dayjs(firstLog.attend_at), "hour", true)
        .toFixed(2),
    };
  };

  const startEndTimes = getStartEndTimes();

  return (
    <Pressable onPress={() => setIsExpanded(!isExpanded)}>
      <View className="mb-3 px-0">
        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3">
                <Calendar className="h-4 w-4 text-primary" />
                <Text className="font-semibold text-foreground">
                  {dayjs(date).locale(language).format("dddd, MMMM D")}
                </Text>
              </View>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0"
                onPress={() => setIsExpanded(!isExpanded)}
              >
                <Text className="text-xs">{isExpanded ? "−" : "+"}</Text>
              </Button>
            </View>

            {startEndTimes && (
              <View className="flex-row items-center justify-between py-2 border border-input rounded-lg px-3 mb-3">
                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center gap-2">
                    <View className="h-3 w-3 rounded-full bg-green-500" />
                    <Text className="text-sm font-medium">
                      {t("attendance.from")}
                    </Text>
                    <Text className="text-sm text-muted-foreground font-mono">
                      {startEndTimes.start}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="h-3 w-3 rounded-full bg-red-500" />
                    <Text className="text-sm font-medium">
                      {t("attendance.to")}
                    </Text>
                    <Text className="text-sm text-muted-foreground font-mono">
                      {startEndTimes.end}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {isExpanded && logs.length > 0 && (
              <View className="space-y-2 pt-2 border-t border-border/50">
                {logs.reverse().map((log, index) => (
                  <View
                    key={log.id || index}
                    className="flex-row items-center justify-between py-2"
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`h-3 w-3 rounded-full ${getTypeColor(log.type)}`}
                      />
                      <Text className="font-medium text-sm text-foreground">
                        <TranslatableEnum value={`${log.type}_attendance`} />
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm text-muted-foreground font-mono">
                        {dayjs(log.attend_at).format("HH:mm")}
                      </Text>
                      <Badge
                        variant={getStatusVariant(log.status)}
                        className="ms-2"
                      >
                        <Text className="text-xs">
                          <TranslatableEnum value={log.status} />
                        </Text>
                      </Badge>
                    </View>
                  </View>
                ))}
              </View>
            )}
            {logs.length === 0 && (
              <View className="flex-row items-center justify-center py-4">
                <View className="h-4 w-4 rounded-full bg-red-500 mr-2" />
                <Text className="text-red-600 text-sm">
                  {t("attendance.no_records")}
                </Text>
              </View>
            )}
          </CardContent>
        </Card>
      </View>
    </Pressable>
  );
};

export default AttendanceDayCard;
