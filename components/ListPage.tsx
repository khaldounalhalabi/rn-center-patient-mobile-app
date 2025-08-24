import { ApiResponse } from "@/http/Response";
import { Plus } from "@/lib/icons/icons";
import { useTranslation } from "@/localization";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, ListRenderItem, View } from "react-native";
import useFilter from "./Filter";
import LoadingSpinner from "./LoadingSpinner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Text } from "./ui/text";

interface ListPageProps<DATAITEM> {
  api: (
    page: number,
    search?: string,
    params?: Record<string, any>,
  ) => Promise<ApiResponse<DATAITEM[]>>;

  filter?: (
    params: Record<string, any> | undefined,
    setParam: (key: string, value: any) => void,
  ) => React.ReactNode;
  enableSearch?: boolean;

  renderItem: ListRenderItem<DATAITEM> | null | undefined;
  queryKey?: string;
  createUrl?: string;
}

function useListPage<DATAITEM>({
  api,
  filter,
  renderItem,
  enableSearch = true,
  queryKey,
  createUrl,
}: ListPageProps<DATAITEM>) {
  const { t } = useTranslation();
  const { params, setParam, Filter } = useFilter();
  const router = useRouter();
  const [search, setSearch] = useState<undefined | string>(undefined);

  const {
    data: items,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["list_view_" + queryKey, search, params],
    queryFn: async ({ pageParam }) => api(pageParam, search, params),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return !lastPage.paginate?.is_last
        ? lastPage.paginate?.current_page
          ? lastPage.paginate?.current_page + 1
          : null
        : null;
    },
    select(data) {
      return data.pages.flatMap((d) => d.data);
    },
  });

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
          {createUrl && (
            <Button
              size={"icon"}
              variant={"secondary"}
              onPress={() => {
                router.push(createUrl as any);
              }}
            >
              <Plus className="text-primary" />
            </Button>
          )}
          {enableSearch && (
            <Input
              className="w-3/4"
              placeholder={t("table.search")}
              onSubmitEditing={(e) => {
                setSearch(e.nativeEvent.text);
              }}
              returnKeyType="search"
            />
          )}
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center p-4">
            <LoadingSpinner className="text-foreground" />
          </View>
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
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View className="items-center my-4">
                  <LoadingSpinner className="text-foreground" />
                </View>
              ) : null
            }
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={() => refetch()}
          />
        )}
      </>
    );
  };

  return { Render, refetch, isLoading };
}

export default useListPage;
