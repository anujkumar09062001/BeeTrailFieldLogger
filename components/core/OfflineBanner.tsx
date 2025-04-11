import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface OfflineBannerProps {
  onRetry: () => void;
  isVisible: boolean;
}

const OfflineBanner = ({ onRetry, isVisible }: OfflineBannerProps) => {
  if (!isVisible) return null;

  return (
    <View className="bg-red-500 flex-row items-center justify-between py-3.5 px-4 w-full absolute top-0 z-50">
      <View className="flex-row items-center">
        <Feather name="wifi-off" size={18} color="#fff" className="mr-2" />
        <Text className="text-white font-medium">You are offline</Text>
      </View>
      <TouchableOpacity
        onPress={onRetry}
        className="bg-white/20 py-1.5 px-3 rounded"
      >
        <Text className="text-white font-medium text-xs">Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OfflineBanner;
