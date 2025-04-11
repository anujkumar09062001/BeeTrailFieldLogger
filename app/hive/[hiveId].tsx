import CustomButton from "@/components/core/CustomBottom";
import LinearBackground from "@/components/layout/LinearBackground";
import { useHiveLoggerStore } from "@/store/useHiveLoggerStore";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router, useGlobalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface HiveEntry {
  hive_id: string;
  date_placed: string;
  num_colonies: number;
  latitude: number;
  longitude: number;
}

const HiveDetailsScreen = () => {
  const { hiveId } = useGlobalSearchParams();
  const getHiveById = useHiveLoggerStore((state) => state.getHiveById);
  const removeHive = useHiveLoggerStore((state) => state.removeHive);

  const [hive, setHive] = useState<HiveEntry | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      const fetchedHive = getHiveById(hiveId as string);
      setHive(fetchedHive);
    }, [hiveId, getHiveById])
  );

  if (!hive) {
    return (
      <LinearBackground>
        <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
          <CustomButton
            variant="icon"
            iconName="arrow-left"
            onPress={() => router.back()}
            className="bg-transparent mr-4"
          />
          <Text className="text-xl font-bold text-gray-800">Hive Detail</Text>
        </View>

        <View className="flex-1 justify-center items-center p-6">
          <Feather name="alert-circle" size={64} color="#9ca3af" />
          <Text className="text-lg font-medium text-gray-100 text-center mt-4">
            Hive not found
          </Text>
          <Text className="text-gray-100 text-center mt-2">
            The hive you're looking for doesn't exist or has been removed.
          </Text>
          <CustomButton
            variant="primary"
            title="Return to Hive List"
            onPress={() => router.push("/")}
            className="mt-8"
          />
        </View>
      </LinearBackground>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Hive",
      `Are you sure you want to remove ${hive.hive_id}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (removeHive(hive.hive_id)) {
              router.push("/(tabs)");
            }
          },
        },
      ]
    );
  };

  const formattedDate = new Date(hive.date_placed).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <LinearBackground>
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-100/10">
        <CustomButton
          variant="link"
          iconName="arrow-left"
          title="Back"
          onPress={() => router.back()}
        />

        <TouchableOpacity onPress={handleDelete}>
          <Feather name="trash-2" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white p-6 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-gray-800">
              {hive.hive_id}
            </Text>
            <View className="bg-amber-100 px-3 py-1 rounded-full">
              <Text className="text-amber-800 font-semibold">
                {hive.num_colonies} colonies
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-6">
            <Feather name="calendar" size={18} color="#6b7280" />
            <Text className="ml-2 text-gray-600">
              Placed on {formattedDate}
            </Text>
          </View>

          <View className="h-56 rounded-lg overflow-hidden mb-4">
            <MapView
              style={{ height: "100%", width: "100%" }}
              initialRegion={{
                latitude: hive.latitude,
                longitude: hive.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: hive.latitude,
                  longitude: hive.longitude,
                }}
                title={hive.hive_id}
              />
            </MapView>
          </View>
        </View>

        <View className="bg-white p-6 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Hive Status
          </Text>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Health</Text>
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-800">Healthy</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Production</Text>
            <Text className="text-gray-800 font-medium">Active</Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Last Inspection</Text>
            <Text className="text-gray-800 font-medium">Not recorded</Text>
          </View>
        </View>

        <View className="bg-white p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Actions
          </Text>

          <CustomButton
            variant="primary"
            title="Edit Hive"
            iconName="edit-2"
            onPress={() => router.push(`/edit-hive/${hive.hive_id}`)}
            className="mb-3"
          />
        </View>
      </ScrollView>
    </LinearBackground>
  );
};

export default HiveDetailsScreen;
