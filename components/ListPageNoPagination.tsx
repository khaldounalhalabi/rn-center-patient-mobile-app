import { ApiResponse } from "@/http/Response";
import { useTranslation } from "@/localization";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, ListRenderItem, View } from "react-native";
import useFilter from "./Filter";
import LoadingScreen from "./LoadingScreen";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Text } from "./ui/text";

interface ListPageNoPaginationProps<DATAITEM> {
  api: (
    search?: string,
    params?: Record<string, any>,
  ) => Promise<ApiResponse<DATAITEM[] | Record<string, any>>>;

  filter?: (
    params: Record<string, any> | undefined,
    setParam: (key: string, value: any) => void,
  ) => React.ReactNode;
  enableSearch?: boolean;

  renderItem: ListRenderItem<DATAITEM> | null | undefined;

  transformData?: (data: DATAITEM[] | Record<string, any>) => DATAITEM[];
  queryKey?: string;
}

function useListPageNoPagination<DATAITEM>({
  api,
  filter,
  renderItem,
  enableSearch = true,
  transformData,
  queryKey,
}: ListPageNoPaginationProps<DATAITEM>) {
  const { t } = useTranslation();
  const { params, setParam, Filter } = useFilter();
  const [search, setSearch] = useState<undefined | string>(undefined);

  const {
    data: rawData,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["list_view_no_pagination_" + queryKey, search, params],
    queryFn: async () => {
      const response = await api(search, params);
      return response.data;
    },
  });

  const items: DATAITEM[] = React.useMemo(() => {
    if (!rawData) return [];

    if (transformData) {
      return transformData(rawData);
    }

    if (Array.isArray(rawData)) {
      return rawData;
    } else if (typeof rawData === "object" && rawData !== null) {
      return Object.entries(rawData).map(([key, value]) => ({
        key,
        value,
        ...(typeof value === "object" ? value : { data: value }),
      })) as DATAITEM[];
    }

    return [];
  }, [rawData, transformData, isRefetching, isLoading]);

  const Render = () => {
    if (isError)
      return (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="mb-4 text-center">{t("types_statuses.failed")}</Text>
          <Button onPress={() => refetch()}>{t("components.retry")}</Button>
        </View>
      );

    return (
      <>
        <View className="w-full p-[16px] flex flex-row justify-between items-center gap-3">
          {filter && <Filter>{filter(params, setParam)}</Filter>}
          {enableSearch && (
            <Input
              dataDetectorTypes={"all"}
              className="w-full"
              placeholder={t("table.search")}
              onChangeText={(value) => {
                if (value.trim().length > 0) {
                  setSearch(value);
                } else {
                  setSearch(value);
                }
              }}
            />
          )}
        </View>

        {isLoading ? (
          <LoadingScreen />
        ) : (
          <FlatList
            contentContainerStyle={{ padding: 16 }}
            data={items}
            renderItem={renderItem}
            ListEmptyComponent={
              <View className="items-center justify-center py-12">
                <Text className="text-muted-foreground">
                  {t("components.no_data")}
                </Text>
              </View>
            }
            refreshing={isRefetching}
            onRefresh={() => refetch()}
          />
        )}
      </>
    );
  };

  return { Render, refetch, isLoading };
}

export default useListPageNoPagination;
