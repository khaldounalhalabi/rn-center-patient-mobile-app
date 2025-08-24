import AttendanceLogTypeEnum from "@/enums/AttendanceLogTypeEnum";
import useTimer from "@/hooks/TimerHook";
import useUser from "@/hooks/UserHook";
import {
  AlertCircleIcon,
  Award,
  Calendar,
  Clock,
  Target,
  Timer,
  TrendingUp,
} from "@/lib/icons/icons";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/localization";
import { RealTimeEventsTypeEnum } from "@/models/NotificationPayload";
import AttendanceLogService from "@/services/AttendanceLogService";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import LoadingSpinner from "../LoadingSpinner";
import NotificationHandler from "../NotificationHandler";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingVertical: 0,
  },
});

const AttendanceCards = () => {
  const { role } = useUser();
  const { t } = useTranslation();
  const service = AttendanceLogService.make(role);
  const {
    data: stats,
    isPending: isPendingStats,
    refetch: refetchStats,
    isRefetching: isRefetchingStats,
  } = useQuery({
    queryKey: ["attendance_stats"],
    queryFn: async () => await service.myStat(),
    select: (data) => data.data,
  });

  const {
    data: logData,
    isPending: isPendingLastLog,
    refetch: refetchLastLog,
    isRefetching: isRefetchinLastLog,
  } = useQuery({
    queryKey: ["last_log"],
    queryFn: async () => await service.lastLog(),
    select: (data) => data.data,
  });

  const checkInMutation = useMutation({
    mutationFn: async () => await service.checkin(),
    onSuccess: async () => {
      await refetchLastLog();
      await refetchStats();
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => await service.checkout(),
    onSuccess: async () => {
      await refetchLastLog();
      await refetchStats();
    },
  });

  const handleCheckIn = () => {
    checkInMutation.mutate();
  };

  const handleCheckOut = () => {
    checkOutMutation.mutate();
  };

  const timer = useTimer({ startTime: logData?.attend_at });

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefetchinLastLog || isRefetchingStats}
          onRefresh={() => {
            refetchLastLog();
            refetchStats();
          }}
        />
      }
      contentContainerStyle={styles.scrollViewContent}
    >
      <View className="w-full">
        <NotificationHandler
          handle={(payload) => {
            if (payload.type == RealTimeEventsTypeEnum.AttendanceEdited) {
              refetchLastLog().then(() => {
                refetchStats();
              });
            }
          }}
          isPermanent
        />
        <View className="grid grid-cols-1 gap-4 p-[16px]">
          <View className="col-span-1 md:col-span-3">
            <Alert icon={AlertCircleIcon} variant={"destructive"}>
              <AlertTitle>{t("attendance.important_note")}</AlertTitle>
              <AlertDescription>
                {t("attendance.no_checkout_warning")}
              </AlertDescription>
            </Alert>
          </View>
          <Card className="transition-all duration-300 hover:shadow-lg">
            {isPendingStats || isPendingLastLog || !stats ? (
              <Skeleton className="w-full h-40" />
            ) : (
              <>
                <CardHeader className="space-y-2">
                  {logData?.type == AttendanceLogTypeEnum.CHECKIN ? (
                    <>
                      <View className="flex flex-row w-full items-center justify-between">
                        <CardTitle className="text-xl font-bold flex flex-row items-center gap-2">
                          <Clock className="text-primary" />
                          <View>
                            <Text>{t("attendance.checked_in")}</Text>
                          </View>
                        </CardTitle>
                        <Badge variant="secondary">
                          <Text className="text-sm">
                            {dayjs(logData?.attend_at).format("HH:mm")}
                          </Text>
                        </Badge>
                      </View>
                      <CardDescription className="text-lg font-medium flex items-center gap-2">
                        <Timer className="  text-primary" />
                        <View>
                          <Text>{timer}</Text>
                        </View>
                      </CardDescription>
                    </>
                  ) : (
                    <>
                      <View className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold flex flex-row items-center gap-2">
                          <Calendar className="text-primary" />
                          <Text>{t("attendance.todays_hours")}</Text>
                        </CardTitle>
                      </View>
                      <CardDescription className="text-lg font-medium">
                        <Text>
                          {dayjs
                            .duration(stats?.attendance_hours_in_day, "hours")
                            .format("HH:mm:ss")}
                        </Text>
                      </CardDescription>
                    </>
                  )}
                </CardHeader>
                <CardContent className="pt-4">
                  <View className="h-1 w-full bg-secondary/20 rounded-full overflow-hidden">
                    <View
                      className={cn(
                        "h-full bg-primary transition-all duration-500",
                        logData?.type === AttendanceLogTypeEnum.CHECKIN
                          ? "animate-pulse"
                          : "",
                      )}
                      style={{
                        width:
                          logData?.type === AttendanceLogTypeEnum.CHECKIN
                            ? "100%"
                            : `${Math.min((stats?.attendance_hours_in_day / 8) * 100, 100)}%`,
                      }}
                    />
                  </View>
                </CardContent>
                <CardFooter className="flex flex-row justify-end pt-4">
                  {(logData?.type == AttendanceLogTypeEnum.CHECKOUT ||
                    !logData) && (
                    <Button
                      onPress={handleCheckIn}
                      className="w-full flex flex-row gap-2 transition-all duration-300 hover:scale-105"
                      size="lg"
                    >
                      {checkInMutation?.isPending ? (
                        <LoadingSpinner className="mr-2 text-primary-foreground" />
                      ) : (
                        <Clock className="mr-2 text-primary-foreground" />
                      )}
                      <Text>{t("attendance.check_in")}</Text>
                    </Button>
                  )}

                  {logData?.type == AttendanceLogTypeEnum.CHECKIN && (
                    <Button
                      onPress={handleCheckOut}
                      variant="destructive"
                      className="w-full flex flex-row gap-2 transition-all duration-300 hover:scale-105"
                      size="lg"
                    >
                      {checkOutMutation?.isPending ? (
                        <LoadingSpinner className="mr-2 text-destructive-foreground" />
                      ) : (
                        <Clock className="mr-2 text-destructive-foreground" />
                      )}
                      <Text>{t("attendance.check_out")}</Text>
                    </Button>
                  )}
                </CardFooter>
              </>
            )}
          </Card>

          {/* Attendance Overview Card */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            {isPendingStats || isPendingLastLog || !stats ? (
              <Skeleton className="w-full h-40" />
            ) : (
              <>
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex flex-row items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <View>
                      <Text>{t("attendance.attendance_overview")}</Text>
                    </View>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <View className="space-y-2">
                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-sm text-muted-foreground">
                        {t("attendance.attendance_days")}
                      </Text>
                      <Text className="font-medium">
                        {stats?.attendance_days} / {stats?.expected_days}
                      </Text>
                    </View>
                    <View className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-primary transition-all duration-500"
                        style={{
                          width: `${Math.min((stats?.attendance_days / stats?.expected_days) * 100, 100)}%`,
                        }}
                      />
                    </View>
                  </View>
                  <View className="space-y-1">
                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-sm text-muted-foreground">
                        {t("attendance.total_hours")}
                      </Text>
                      <Text className="font-medium">
                        {`${Math.floor(stats?.attendance_hours)} / ${stats?.expected_hours}`}
                      </Text>
                    </View>
                    <View className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-primary transition-all duration-500"
                        style={{
                          width: `${Math.min((stats?.attendance_hours / stats?.expected_hours) * 100, 100)}%`,
                        }}
                      />
                    </View>
                  </View>
                  <View className="space-y-2">
                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-sm text-muted-foreground">
                        {t("attendance.overtime_hours")}
                      </Text>
                      <Text className="font-medium text-emerald-600">
                        {stats?.overtime_hours?.toFixed(1) || 0}{" "}
                        {t("attendance.hours")}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-sm text-muted-foreground">
                        {t("attendance.overtime_days")}
                      </Text>
                      <Text className="font-medium text-emerald-600">
                        {stats?.overtime_days || 0} {t("attendance.days")}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </>
            )}
          </Card>

          {/* Absence Card */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            {isPendingStats || isPendingLastLog || !stats ? (
              <Skeleton className="w-full h-40" />
            ) : (
              <>
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex flex-row items-center gap-2">
                    <Target className="text-primary" />
                    <View>
                      <Text>{t("attendance.absence_summary")}</Text>
                    </View>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <View className="flex flex-row justify-between gap-4">
                    <View className="space-y-1">
                      <Text className="text-sm text-muted-foreground">
                        {t("attendance.absence_days")}
                      </Text>
                      <Text className="text-2xl font-bold">
                        {stats?.absence_days}
                      </Text>
                    </View>
                    <View className="space-y-1">
                      <Text className="text-sm text-muted-foreground">
                        {t("attendance.attendance_rate")}
                      </Text>
                      <Text className="text-2xl font-bold">
                        {Math.round(
                          (stats?.attendance_days /
                            (stats?.attendance_days + stats?.absence_days)) *
                            100,
                        )}
                        %
                      </Text>
                    </View>
                  </View>
                  <View className="pt-2">
                    <View className="flex flex-row items-center gap-2 text-sm text-muted-foreground">
                      <Award className="text-primary" />
                      <View>
                        <Text>
                          {t("attendance.expected_days")}:{" "}
                          {stats?.expected_days}
                        </Text>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </>
            )}
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};

export default AttendanceCards;
