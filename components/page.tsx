import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "./ui/text";

const Page = ({
  children,
  title,
}: {
  children?: React.ReactNode;
  title?: string;
}) => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full p-5 flex flex-col gap-3">
          {title && <Text className="font-bold text-xl">{title}</Text>}
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Page;
