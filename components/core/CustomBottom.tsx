import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "link"
  | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface CustomButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  iconName?: keyof typeof Feather.glyphMap;
  iconPosition?: "left" | "right";
  className?: string;
  textClassName?: string;
}

const CustomButton = ({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  iconName,
  iconPosition = "left",
  className = "",
  textClassName = "",
  disabled = false,
  ...props
}: CustomButtonProps) => {
  // Base classes
  let buttonClasses = "";
  let textClasses = "";
  let iconSize = 20;
  let iconColor = "#ffffff";

  // Size classes
  switch (size) {
    case "sm":
      buttonClasses += " px-3 py-1.5";
      textClasses += " text-sm";
      iconSize = 16;
      break;
    case "lg":
      buttonClasses += " px-5 py-3";
      textClasses += " text-lg";
      iconSize = 24;
      break;
    case "md":
    default:
      buttonClasses += " px-4 py-2";
      textClasses += " text-base";
      iconSize = 20;
  }

  // Variant classes
  switch (variant) {
    case "secondary":
      buttonClasses += " bg-gray-500";
      textClasses += " text-white font-medium";
      iconColor = "#ffffff";
      break;
    case "outline":
      buttonClasses += " bg-transparent border border-amber-500";
      textClasses += " text-amber-500 font-medium";
      iconColor = "#f59e0b";
      break;
    case "danger":
      buttonClasses += " bg-red-500";
      textClasses += " text-white font-medium";
      iconColor = "#ffffff";
      break;
    case "link":
      buttonClasses += " bg-transparent";
      textClasses += " text-amber-500 font-medium";
      iconColor = "#f59e0b";
      break;
    case "icon":
      buttonClasses += " justify-center items-center";
      textClasses += " text-white font-medium";
      if (size === "sm") {
        buttonClasses += " w-8 h-8";
      } else if (size === "lg") {
        buttonClasses += " w-12 h-12";
      } else {
        buttonClasses += " w-10 h-10";
      }
      break;
    case "primary":
    default:
      buttonClasses += " bg-primary";
      textClasses += " text-white font-medium";
      iconColor = "#ffffff";
  }

  // Disabled state
  if (disabled || isLoading) {
    buttonClasses += " opacity-50";
  }

  // Border radius
  buttonClasses += " rounded-lg";

  // Icon component
  const Icon = iconName ? (
    <Feather name={iconName} size={iconSize} color={iconColor} />
  ) : null;

  return (
    <TouchableOpacity
      className={`${buttonClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "link" ? "#f59e0b" : "#ffffff"
          }
        />
      ) : (
        <View className="flex-row items-center justify-center">
          {Icon && iconPosition === "left" && (
            <View className="mr-2">{Icon}</View>
          )}

          {title && (
            <Text className={`${textClasses} ${textClassName}`}>{title}</Text>
          )}

          {Icon && iconPosition === "right" && (
            <View className="ml-2">{Icon}</View>
          )}

          {variant === "icon" && Icon && !title && Icon}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
