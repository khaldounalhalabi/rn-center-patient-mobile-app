import { View } from "react-native";
import LoadingSpinner from "./LoadingSpinner";

const LoadingScreen = () => {
  return (
    <View
      className={
        "flex-1 h-screen w-screen items-center justify-center bg-background"
      }
    >
      <LoadingSpinner className="text-foreground" size={40} />
    </View>
  );
};

export default LoadingScreen;
