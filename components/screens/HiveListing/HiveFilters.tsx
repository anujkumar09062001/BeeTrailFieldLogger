import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomTextInput from "@/components/core/CustomTextInput";

type FilterOptions = {
  startDate: Date | null;
  endDate: Date | null;
  locationRadius: number | null;
  locationName: string;
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
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleResetFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      locationRadius: null,
      locationName: "",
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Select date";
    return date.toLocaleDateString();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-2/3">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Filter Hives
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#1f2937" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <View className="mb-6">
              <Text className="text-gray-800 font-bold mb-3">
                Placement Date Range
              </Text>

              <TouchableOpacity
                className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 mb-3"
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text className="text-gray-700">From</Text>
                <Text className="text-gray-800 font-medium">
                  {formatDate(filters.startDate)}
                </Text>
              </TouchableOpacity>

              {showStartDatePicker && (
                <DateTimePicker
                  value={filters.startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowStartDatePicker(false);
                    if (selectedDate) {
                      setFilters({ ...filters, startDate: selectedDate });
                    }
                  }}
                />
              )}

              <TouchableOpacity
                className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3"
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text className="text-gray-700">To</Text>
                <Text className="text-gray-800 font-medium">
                  {formatDate(filters.endDate)}
                </Text>
              </TouchableOpacity>

              {showEndDatePicker && (
                <DateTimePicker
                  value={filters.endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowEndDatePicker(false);
                    if (selectedDate) {
                      setFilters({ ...filters, endDate: selectedDate });
                    }
                  }}
                />
              )}
            </View>

            <View className="mb-6">
              <CustomTextInput
                label="Location Name"
                placeholder="Filter by location name"
                value={filters.locationName}
                onChangeText={(text) =>
                  setFilters({ ...filters, locationName: text })
                }
                labelClassName="text-gray-800 font-bold"
              />
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
          </ScrollView>

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
