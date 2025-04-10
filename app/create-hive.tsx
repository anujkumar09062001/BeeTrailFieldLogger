import CustomButton from "@/components/core/CustomBottom";
import LinearBackground from "@/components/layout/LinearBackground";
import {
  HiveForm,
  HiveFormData,
  HiveFormRef,
} from "@/components/screens/CreateEditHive/HiveForm";
import { useHiveLoggerStore } from "@/store/useHiveLoggerStore";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";

const CreateHiveScreen: React.FC = () => {
  const addHive = useHiveLoggerStore((state) => state.addHive);
  const formRef = useRef<HiveFormRef>(null);

  const handleSubmit = (formData: HiveFormData): void => {
    // Check if hive ID already exists
    const getAllHives = useHiveLoggerStore.getState().getAllHives;
    const existingHive = getAllHives().find(
      (h) => h.hive_id === formData.hive_id
    );

    if (existingHive) {
      Alert.alert(
        "Duplicate Hive ID",
        "A hive with this ID already exists. Please use a different ID.",
        [{ text: "OK" }]
      );
      return;
    }

    // Add the new hive
    addHive(formData);

    // Navigate back to the list
    router.back();
  };

  const handleValidationError = (): void => {
    Alert.alert(
      "Validation Error",
      "Please check the form for errors and try again.",
      [{ text: "OK" }]
    );
  };

  return (
    <LinearBackground className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200 bg-white">
          <CustomButton
            variant="link"
            iconName="arrow-left"
            title="Back"
            onPress={() => router.back()}
          />
          <Text className="text-xl font-bold text-gray-800">Add New Hive</Text>
          <CustomButton
            variant="primary"
            title="Save"
            size="sm"
            onPress={() => formRef.current?.submit()}
          />
        </View>

        <HiveForm
          ref={formRef}
          onSubmit={handleSubmit}
          onValidationError={handleValidationError}
        />

        {/* Floating Save Button */}
        <View className="absolute bottom-6 right-6">
          <CustomButton
            variant="primary"
            title="Save Hive"
            iconName="save"
            size="lg"
            onPress={() => formRef.current?.submit()}
          />
        </View>
      </KeyboardAvoidingView>
    </LinearBackground>
  );
};

export default CreateHiveScreen;
