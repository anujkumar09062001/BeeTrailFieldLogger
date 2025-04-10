import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface LinearBackgroundProps {
  children: ReactNode;
  className?: string;
  bottomInsets?: boolean;
  style?: ViewStyle;
}

const LinearBackground = ({
  children,
  className = "",
  bottomInsets = true,
  style,
}: LinearBackgroundProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={`flex-1 ${className}`}
      style={{
        marginTop: insets.top,
        ...style,
      }}
    >
      <LinearGradient
        colors={["#FFFFFF", "#FFFFFF"]} // Fixed the color values
        style={{
          flex: 1,
          paddingBottom: bottomInsets ? insets.bottom : 0,
        }}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

export default LinearBackground;
