import { formatFloweringWindow, isCurrentlyFlowering } from "@/utils/helper";
import React from "react";
import { Text, View } from "react-native";

const CropUiCard = ({ crop }: { crop: Crop }) => {
  const flowering = isCurrentlyFlowering(
    crop?.flowering_start,
    crop?.flowering_end
  );
  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-lg">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-800">{crop?.name}</Text>
        <View
          className={
            flowering
              ? "bg-green-500 px-2 py-1 rounded"
              : "bg-blue-500 px-2 py-1 rounded"
          }
        >
          <Text className="text-xs font-bold text-white">
            {flowering ? "FLOWERING NOW" : "UPCOMING"}
          </Text>
        </View>
      </View>

      {crop?.distance !== undefined && (
        <Text className="text-gray-500 text-sm mb-3">
          {crop?.distance.toFixed(1)} km away
        </Text>
      )}

      <View className="mt-2">
        <View className="flex-row mb-2">
          <Text className="text-sm font-semibold text-gray-700 mr-1">
            Flowering Window:
          </Text>
          <Text className="text-sm text-gray-800">
            {formatFloweringWindow(crop?.flowering_start, crop?.flowering_end)}
          </Text>
        </View>

        <View className="flex-row">
          <Text className="text-sm font-semibold text-gray-700 mr-1">
            Recommended Hive Density:
          </Text>
          <Text className="text-sm text-gray-800">
            {crop?.recommended_hive_density} hives/acre
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CropUiCard;
