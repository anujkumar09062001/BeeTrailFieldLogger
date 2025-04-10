import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

const CustomTextInput = ({
  label,
  error,
  containerClassName = "",
  labelClassName = "",
  inputClassName = "",
  errorClassName = "",
  ...props
}: CustomTextInputProps) => {
  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className={`text-gray-700 font-bold mb-2 ${labelClassName}`}>
          {label}
        </Text>
      )}

      <TextInput
        className={`border border-gray-300 rounded-lg px-4 py-2 ${
          error ? "border-red-500" : ""
        } ${inputClassName}`}
        placeholderTextColor="#9ca3af"
        {...props}
      />

      {error && (
        <Text className={`text-red-500 text-sm mt-1 ${errorClassName}`}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default CustomTextInput;
