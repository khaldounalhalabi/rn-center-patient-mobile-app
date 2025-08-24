import { i18n } from "@/localization";
import { Text, TextProps } from "react-native";

const StyledText = ({ style, ...props }: TextProps) => {
  const locale = i18n.locale;
  return (
    <Text
      style={{
        fontFamily: locale == "en" ? "kodchasan" : "cairo",
      }}
      {...props}
    />
  );
};

export default StyledText;
