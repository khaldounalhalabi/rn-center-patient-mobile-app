import React from "react";
import { Platform, ScrollView, View } from "react-native";
import { Text } from "./ui/text";

const Page = ({
  children,
  title,
}: {
  children?: React.ReactNode;
  title?: string;
}) => {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: Platform.OS === "ios" ? 100 : 120,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
      keyboardDismissMode="interactive"
    >
      <View className="w-full p-5 flex flex-col gap-3">
        {title && <Text className="font-bold text-xl">{title}</Text>}
        {children}
      </View>
    </ScrollView>
  );
};

export default Page;
