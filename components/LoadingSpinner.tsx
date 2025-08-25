import { Loader2 } from "@/lib/icons/Loader2";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

const LoadingSpinner = ({
  className = undefined,
  size = 16,
}: {
  className?: string;
  size?: number;
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transform: [{ rotate: spin }],
      }}
    >
      <Loader2
        className={cn("text-secondary", className)}
        size={size}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          alignSelf: "center",
          justifyContent: "center",
        }}
      />
    </Animated.View>
  );
};

export default LoadingSpinner;
