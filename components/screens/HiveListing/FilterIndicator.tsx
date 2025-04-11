import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type FilterOptions = {
  locationRadius: number | null;
};

interface FilterIndicatorProps {
  filters: FilterOptions;
  onClearFilters: () => void;
}

const FilterIndicator = ({ filters, onClearFilters }: FilterIndicatorProps) => {
  const hasActiveFilters = filters.locationRadius !== null;

  if (!hasActiveFilters) return null;

  return (
    <View className="flex-row flex-wrap px-4 py-2 gap-2 bg-gray-50 border-b border-gray-200">
      <View className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-full">
        <Feather name="filter" size={14} color="#1f2937" />
        <Text className="text-gray-800 font-medium text-sm ml-1">
          1 filter active
        </Text>
      </View>

      {filters.locationRadius && (
        <View className="bg-white px-3 py-1.5 rounded-full flex-row items-center">
          <Feather name="map-pin" size={14} color="#4b5563" />
          <Text className="text-gray-800 text-sm ml-1">
            Within {filters.locationRadius} km
          </Text>
        </View>
      )}

      <TouchableOpacity
        className="bg-white px-3 py-1.5 rounded-full flex-row items-center ml-auto"
        onPress={onClearFilters}
      >
        <Text className="text-gray-700 text-sm font-medium">Clear</Text>
        <Feather name="x" size={14} color="#4b5563" className="ml-1" />
      </TouchableOpacity>
    </View>
  );
};

export default FilterIndicator;
