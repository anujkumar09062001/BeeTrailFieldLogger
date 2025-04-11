import CustomButton from "@/components/core/CustomBottom";
import LinearBackground from "@/components/layout/LinearBackground";
import {
  HiveForm,
  HiveFormData,
  HiveFormRef,
} from "@/components/screens/CreateEditHive/HiveForm";
import { useHiveLoggerStore } from "@/store/useHiveLoggerStore";
import { router, useGlobalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { Toast } from "toastify-react-native";

const EditHiveScreen = () => {
  const { hiveId: hiveIdParam } = useGlobalSearchParams();
  const formRef = useRef<HiveFormRef>(null);

  const getHiveById = useHiveLoggerStore((state) => state.getHiveById);
  const updateHive = useHiveLoggerStore((state) => state.updateHive);
  const removeHive = useHiveLoggerStore((state) => state.removeHive);
  const addHive = useHiveLoggerStore((state) => state.addHive);

  const originalHive = getHiveById(hiveIdParam as string);

  useEffect(() => {
    if (!originalHive) {
      Toast.error("Hive Not Found");
    }
  }, [originalHive]);

  const handleSubmit = (formData: HiveFormData): void => {
    if (!originalHive) return;

    if (originalHive.hive_id !== formData.hive_id) {
      const getAllHives = useHiveLoggerStore.getState().getAllHives;
      const existingHive = getAllHives().find(
        (h) =>
          h.hive_id === formData.hive_id && h.hive_id !== originalHive.hive_id
      );

      if (existingHive) {
        Toast.error(
          "A hive with this ID already exists. Please use a different ID."
        );
        return;
      }

      Alert.alert(
        "Change Hive ID",
        "Changing the Hive ID will create a new hive. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => {
              removeHive(originalHive.hive_id);

              addHive(formData);

              router.push("/(tabs)");
            },
          },
        ]
      );
      return;
    }

    updateHive(originalHive.hive_id, formData);

    router.back();
  };

  const handleValidationError = (): void => {
    Toast.error("Please check the form for errors and try again.");
  };

  if (!originalHive) {
    return null;
  }

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
          <Text className="text-xl font-bold text-gray-800">Edit Hive</Text>
          <CustomButton
            variant="primary"
            title="Save"
            size="sm"
            onPress={() => formRef.current?.submit()}
          />
        </View>

        <HiveForm
          ref={formRef}
          initialData={originalHive}
          onSubmit={handleSubmit}
          onValidationError={handleValidationError}
        />

        <View className="absolute bottom-6 right-6">
          <CustomButton
            variant="primary"
            title="Save Changes"
            iconName="save"
            size="lg"
            onPress={() => formRef.current?.submit()}
          />
        </View>
      </KeyboardAvoidingView>
    </LinearBackground>
  );
};

export default EditHiveScreen;
