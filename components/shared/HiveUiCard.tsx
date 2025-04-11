import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface HiveEntry {
  hive_id: string;
  date_placed: string;
  num_colonies: number;
  latitude: number;
  longitude: number;
}

const HiveUiCard = ({ hive }: { hive: HiveEntry }) => {
  const navigateToHiveDetail = (hiveId: string): void => {
    router.push(`/hive/${hiveId}`);
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-3 shadow-lg"
      onPress={() => navigateToHiveDetail(hive?.hive_id)}
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-bold text-black">{hive?.hive_id}</Text>
        <View className="bg-primary/10 px-2 py-1 rounded-full">
          <Text className="text-primary font-medium text-base">
            {hive?.num_colonies} colonies
          </Text>
        </View>
      </View>

      <Text className="text-gray-100 mt-1 text-sm">
        {new Date(hive?.date_placed).toLocaleDateString()}
      </Text>

      <View className="h-28 rounded-lg overflow-hidden mt-2 mb-1">
        <MapView
          style={{ height: "100%", width: "100%" }}
          initialRegion={{
            latitude: hive?.latitude,
            longitude: hive?.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: hive?.latitude,
              longitude: hive?.longitude,
            }}
            title={hive?.hive_id}
          />
        </MapView>
      </View>
    </TouchableOpacity>
  );
};

export default HiveUiCard;
