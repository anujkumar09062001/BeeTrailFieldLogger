import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import CustomButton from "./CustomBottom";

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface CustomLocationPickerProps {
  label?: string;
  value: LocationData | null;
  onChange: (location: LocationData | null) => void;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
}

const CustomLocationPicker = ({
  label = "Location",
  value,
  onChange,
  error,
  containerClassName = "",
  labelClassName = "",
}: CustomLocationPickerProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      requestLocation();
    }
  }, []);

  const requestLocation = async (): Promise<void> => {
    setLoading(true);
    setLocationError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationError("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const locationData: LocationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      // Try to get address
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        });

        if (reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          const addressString = [
            address.street,
            address.city,
            address.region,
            address.country,
          ]
            .filter(Boolean)
            .join(", ");

          locationData.address = addressString;
        }
      } catch (error) {
        console.log("Error getting address:", error);
        // We still have coordinates, so we can continue
      }

      onChange(locationData);
    } catch (error) {
      setLocationError("Could not get your location");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className={`mb-4 ${containerClassName}`}>
      <View className="flex-row justify-between items-center mb-4">
        {label && (
          <Text className={`text-gray-700 font-bold ${labelClassName}`}>
            {label}
          </Text>
        )}

        <CustomButton
          variant="link"
          iconName="refresh-cw"
          title="Refresh"
          size="sm"
          onPress={requestLocation}
          disabled={loading}
        />
      </View>

      {loading ? (
        <View className="items-center py-4">
          <ActivityIndicator color="#f59e0b" />
          <Text className="text-gray-500 mt-2">Getting location...</Text>
        </View>
      ) : locationError ? (
        <View className="bg-red-50 p-3 rounded-lg mb-4">
          <Text className="text-red-500">{locationError}</Text>
          <CustomButton
            variant="secondary"
            title="Try Again"
            size="sm"
            onPress={requestLocation}
            className="mt-2 bg-gray-200"
            textClassName="text-gray-700"
          />
        </View>
      ) : value ? (
        <View>
          <View className="flex-row items-center mb-2">
            <Feather name="map-pin" size={16} color="#6b7280" />
            <Text className="text-gray-600 ml-2">
              {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
            </Text>
          </View>
          {value.address && (
            <Text className="text-gray-600 ml-6">{value.address}</Text>
          )}
        </View>
      ) : (
        <CustomButton
          variant="secondary"
          title="Get Current Location"
          iconName="map-pin"
          onPress={requestLocation}
          className="bg-gray-200"
          textClassName="text-gray-700"
        />
      )}

      {error && <Text className="text-red-500 text-sm mt-2">{error}</Text>}
    </View>
  );
};

export default CustomLocationPicker;
