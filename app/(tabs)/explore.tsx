import LinearBackground from "@/components/layout/LinearBackground";
import CropUiCard from "@/components/shared/CropUiCard";
import { CROP_DUMMY_DATA } from "@/utils/dummyData";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import LocationFallbackModal from "@/components/shared/LocationFallbackModal";
import { useLocationStore, isLocationStale } from "@/store/useLocationStore";
import { Feather } from "@expo/vector-icons";

const Explore = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [crops, setCrops] = useState<Crop[]>([]);
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
    const initializeLocation = async () => {
      try {
        if (
          userLocation &&
          !isLocationStale(userLocation) &&
          locationPermissionStatus !== "undetermined"
        ) {
          processAndFilterCrops(userLocation);
          setLoading(false);
          return;
        }

        if (locationPermissionStatus === "denied" && !userLocation) {
          setShowLocationModal(true);
          setLoading(false);
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermissionStatus(
          status === "granted" ? "granted" : "denied"
        );

        if (status === "granted") {
          getUserLocation();
        } else {
          if (!userLocation) {
            setShowLocationModal(true);
          }
          setLoading(false);
        }
      } catch (err) {
        console.warn("Error requesting location permission:", err);

        if (!userLocation) {
          setShowLocationModal(true);
        }
        setLoading(false);
      }
    };

    initializeLocation();
  }, []);

  const getUserLocation = async (): Promise<void> => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      let address;
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (reverseGeocode.length > 0) {
          const addressObj = reverseGeocode[0];
          address = [
            addressObj.street,
            addressObj.city,
            addressObj.region,
            addressObj.country,
          ]
            .filter(Boolean)
            .join(", ");
        }
      } catch (error) {
        console.log("Error getting address:", error);
      }

      setUserLocation({
        latitude,
        longitude,
        address,
        timestamp: Date.now(),
      });

      setIsManuallyEntered(false);
      processAndFilterCrops({ latitude, longitude });
    } catch (error) {
      console.log("Error getting location:", error);

      if (!userLocation) {
        setShowLocationModal(true);
      }
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
    processAndFilterCrops({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setShowLocationModal(false);
  };

  const handleOpenLocationModal = () => {
    setShowLocationModal(true);
  };

  const handleCloseLocationModal = () => {
    if (userLocation) {
      setShowLocationModal(false);
    }
  };

  const processAndFilterCrops = (
    location: { latitude: number; longitude: number } | null
  ): void => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const filteredCrops = CROP_DUMMY_DATA.filter((crop) => {
      const floweringStart = new Date(crop.flowering_start);
      const floweringEnd = new Date(crop.flowering_end);

      return floweringEnd >= today && floweringStart <= thirtyDaysFromNow;
    });

    if (location) {
      const cropsWithDistance = filteredCrops.map((crop) => {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          crop.location.latitude,
          crop.location.longitude
        );

        return {
          ...crop,
          distance,
        };
      });

      setCrops(
        cropsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0))
      );
    } else {
      setCrops(filteredCrops);
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  const renderCropItem = ({ item }: { item: Crop }) => {
    return <CropUiCard crop={item} />;
  };

  return (
    <LinearBackground>
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold mb-2 text-gray-800">
          Nearby Crop Opportunities
        </Text>

        {userLocation && (
          <TouchableOpacity
            className="mb-4 flex-row items-center"
            onPress={handleOpenLocationModal}
          >
            <Feather name="map-pin" size={16} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-2 flex-1">
              {isManuallyEntered && userLocation.address
                ? userLocation.address
                : `${userLocation.latitude.toFixed(
                    4
                  )}, ${userLocation.longitude.toFixed(4)}`}
            </Text>
            <Feather name="edit-2" size={14} color="#6b7280" />
          </TouchableOpacity>
        )}

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-600">Loading nearby crops...</Text>
          </View>
        ) : crops.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-600">
              No current or upcoming flowering crops found nearby.
            </Text>
          </View>
        ) : (
          <FlatList
            data={crops}
            renderItem={renderCropItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        <LocationFallbackModal
          isVisible={showLocationModal}
          onLocationSelected={handleManualLocationSelected}
          onClose={handleCloseLocationModal}
          hasExistingLocation={!!userLocation}
        />
      </View>
    </LinearBackground>
  );
};

export default Explore;
