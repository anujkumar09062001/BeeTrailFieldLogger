import { useLocationStore } from "@/store/useLocationStore";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import LocationFallbackModal from "../shared/LocationFallbackModal";
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
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  const {
    userLocation,
    locationPermissionStatus,
    isManuallyEntered,
    setUserLocation,
    setLocationPermissionStatus,
    setIsManuallyEntered,
  } = useLocationStore();

  useEffect(() => {
    if (!value && userLocation) {
      onChange({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        address: userLocation.address,
      });
    } else if (!value && !userLocation) {
      initializeLocation();
    }
  }, []);

  const handleCloseLocationModal = () => {
    if (value) {
      setShowLocationModal(false);
    }
  };

  const initializeLocation = async (): Promise<void> => {
    setLoading(true);
    setLocationError(null);

    try {
      if (locationPermissionStatus === "granted") {
        getUserLocation();
        return;
      }

      if (locationPermissionStatus === "denied") {
        setShowLocationModal(true);
        setLoading(false);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermissionStatus(status === "granted" ? "granted" : "denied");

      if (status === "granted") {
        getUserLocation();
      } else {
        setShowLocationModal(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error initializing location:", error);
      setLocationError("Could not get your location");
      setLoading(false);
    }
  };

  const getUserLocation = async (): Promise<void> => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const locationData: LocationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

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
      }

      // Store in Zustand
      setUserLocation({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.address,
        timestamp: Date.now(),
      });

      setIsManuallyEntered(false);

      onChange(locationData);
    } catch (error) {
      setLocationError("Could not get your location");
      setShowLocationModal(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualLocationSelected = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setUserLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
      timestamp: Date.now(),
    });

    setIsManuallyEntered(true);

    onChange({
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
    });

    setShowLocationModal(false);
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
          onPress={initializeLocation}
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
            onPress={initializeLocation}
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
          onPress={initializeLocation}
          className="bg-gray-200"
          textClassName="text-gray-700"
        />
      )}

      {error && <Text className="text-red-500 text-sm mt-2">{error}</Text>}

      <LocationFallbackModal
        isVisible={showLocationModal}
        onLocationSelected={handleManualLocationSelected}
        onClose={handleCloseLocationModal}
        hasExistingLocation={!!value}
      />
    </View>
  );
};

export default CustomLocationPicker;
