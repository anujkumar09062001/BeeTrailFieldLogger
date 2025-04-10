import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type FilterOptions = {
  startDate: Date | null;
  endDate: Date | null;
  locationRadius: number | null;
  locationName: string;
};

interface FilterIndicatorProps {
  filters: FilterOptions;
  onClearFilters: () => void;
}

const FilterIndicator = ({ filters, onClearFilters }: FilterIndicatorProps) => {
  const hasActiveFilters =
    filters.startDate !== null ||
    filters.endDate !== null ||
    filters.locationRadius !== null ||
    filters.locationName !== "";

  if (!hasActiveFilters) return null;

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString();
  };

  const activeFilterCount = [
    filters.startDate,
    filters.endDate,
    filters.locationName,
    filters.locationRadius,
  ].filter((f) => f !== null && f !== "").length;

  return (
    <View className="flex-row flex-wrap px-4 py-2 gap-2 bg-gray-50 border-b border-gray-200">
      <View className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-full">
        <Feather name="filter" size={14} color="#1f2937" />
        <Text className="text-gray-800 font-medium text-sm ml-1">
          {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"}{" "}
          active
        </Text>
      </View>

      {filters.startDate && filters.endDate && (
        <View className="bg-white px-3 py-1.5 rounded-full flex-row items-center">
          <Feather name="calendar" size={14} color="#4b5563" />
          <Text className="text-gray-800 text-sm ml-1">
            {formatDate(filters.startDate)} - {formatDate(filters.endDate)}
          </Text>
        </View>
      )}

      {filters.locationName && (
        <View className="bg-white px-3 py-1.5 rounded-full flex-row items-center">
          <Feather name="map" size={14} color="#4b5563" />
          <Text className="text-gray-800 text-sm ml-1">
            {filters.locationName}
          </Text>
        </View>
      )}

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
        <Text className="text-gray-700 text-sm font-medium">Clear All</Text>
        <Feather name="x" size={14} color="#4b5563" className="ml-1" />
      </TouchableOpacity>
    </View>
  );
};

export default FilterIndicator;
