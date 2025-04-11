import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomTextInput from "@/components/core/CustomTextInput";

type FilterOptions = {
  locationRadius: number | null;
};

interface HiveFiltersProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const HiveFilters = ({
  isVisible,
  onClose,
  onApplyFilters,
  currentFilters,
}: HiveFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleResetFilters = () => {
    setFilters({
      locationRadius: null,
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-1/3">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Filter Hives
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#1f2937" />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <CustomTextInput
              label="Location Radius (km)"
              placeholder="Enter radius in kilometers"
              keyboardType="numeric"
              value={filters.locationRadius?.toString() || ""}
              onChangeText={(text) => {
                const radius = text ? parseFloat(text) : null;
                setFilters({ ...filters, locationRadius: radius });
              }}
              labelClassName="text-gray-800 font-bold"
            />
          </View>

          <View className="flex-row justify-between pt-4 border-t border-gray-200">
            <TouchableOpacity
              className="py-3 px-5 rounded-lg border border-gray-300"
              onPress={handleResetFilters}
            >
              <Text className="text-gray-700 font-medium">Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-3 px-5 rounded-lg bg-primary"
              onPress={handleApply}
            >
              <Text className="text-white font-medium">Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default HiveFilters;
