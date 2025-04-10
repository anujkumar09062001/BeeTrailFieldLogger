import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface CustomDatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
  minDate?: Date;
  maxDate?: Date;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  pickerClassName?: string;
  errorClassName?: string;
}

const CustomDatePicker = ({
  label,
  value,
  onChange,
  mode = "date",
  minDate,
  maxDate,
  error,
  containerClassName = "",
  labelClassName = "",
  pickerClassName = "",
  errorClassName = "",
}: CustomDatePickerProps) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleConfirm = (selectedDate: Date) => {
    setShowPicker(false);
    onChange(selectedDate);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  const toggleDatepicker = () => {
    setShowPicker(true);
  };

  const formatDisplayValue = () => {
    if (mode === "time") {
      return value.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (mode === "datetime") {
      return `${value.toLocaleDateString()} ${value.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    return value.toLocaleDateString();
  };

  const getIcon = () => {
    if (mode === "time") return "clock";
    if (mode === "datetime") return "calendar-clock";
    return "calendar";
  };

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className={`text-gray-700 font-bold mb-2 ${labelClassName}`}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        className={`border border-gray-300 rounded-lg px-4 py-2 mb-2 flex-row justify-between items-center ${
          error ? "border-red-500" : ""
        } ${pickerClassName}`}
        onPress={toggleDatepicker}
      >
        <Text className="text-gray-800">{formatDisplayValue()}</Text>
        <Feather name={getIcon()} size={20} color="#6b7280" />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showPicker}
        mode={mode}
        date={value}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        minimumDate={minDate}
        maximumDate={maxDate}
        display="spinner"
        isDarkModeEnabled={false}
        textColor="#000"
      />

      {error && (
        <Text className={`text-red-500 text-sm mt-1 ${errorClassName}`}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default CustomDatePicker;
