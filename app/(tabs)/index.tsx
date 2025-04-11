import CustomTextInput from "@/components/core/CustomTextInput";
import LinearBackground from "@/components/layout/LinearBackground";
import FilterIndicator from "@/components/screens/HiveListing/FilterIndicator";
import HiveFilters from "@/components/screens/HiveListing/HiveFilters";
import HiveUiCard from "@/components/shared/HiveUiCard";
import { useHiveLoggerStore } from "@/store/useHiveLoggerStore";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";

interface UserLocation {
  latitude: number;
  longitude: number;
}

type FilterOptions = {
  locationRadius: number | null;
};

const defaultFilters: FilterOptions = {
  locationRadius: null,
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance;
};

const HiveListScreen = () => {
  const allHives = useHiveLoggerStore((state) =>
    state.getAllHives()
  ) as HiveEntry[];
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  // Get user's location when component mounts
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, []);

  const filteredHives = useMemo((): HiveEntry[] => {
    return allHives.filter((hive: HiveEntry) => {
      // Filter by location radius
      if (
        filters.locationRadius &&
        userLocation &&
        hive.latitude &&
        hive.longitude
      ) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          hive.latitude,
          hive.longitude
        );

        // Return false if the hive is outside the radius
        if (distance > filters.locationRadius) {
          return false;
        }
      }

      // Filter by search query (if any)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          hive.hive_id.toLowerCase().includes(query) ||
          String(hive.num_colonies).includes(query)
        );
      }

      return true;
    });
  }, [allHives, filters, searchQuery, userLocation]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const navigateToCreateHive = () => {
    router.push("/create-hive");
  };

  const handleApplyFilters = (newFilters: FilterOptions): void => {
    setFilters(newFilters);
  };

  const handleClearFilters = (): void => {
    setFilters(defaultFilters);
  };

  const renderEmptyList = (): JSX.Element => (
    <View className="flex-1 justify-center items-center p-6">
      <Feather name="inbox" size={64} color="#9ca3af" />
      <Text className="text-lg text-gray-100 font-medium mt-4 text-center">
        No hives found
      </Text>
      <Text className="text-gray-100 text-center mt-2">
        {filters.locationRadius
          ? "Try adjusting your radius filter"
          : "Tap the + button to add your first hive"}
      </Text>
    </View>
  );

  const renderHiveItem = ({
    item,
  }: ListRenderItemInfo<HiveEntry>): JSX.Element => <HiveUiCard hive={item} />;

  return (
    <LinearBackground>
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-100/10">
        <Text className="text-2xl font-bold text-primary">My Hives</Text>
        <View className="flex-row">
          <TouchableOpacity
            className="mr-2"
            onPress={() => setShowSearch(!showSearch)}
          >
            <Feather
              name={showSearch ? "x" : "search"}
              size={24}
              color="#1f2937"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFilters(true)}>
            <Feather name="filter" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      {showSearch && (
        <View className="px-4 py-2 bg-white">
          <CustomTextInput
            placeholder="Search by hive id"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            inputClassName="bg-gray-50"
          />
        </View>
      )}

      <FilterIndicator filters={filters} onClearFilters={handleClearFilters} />

      <FlatList
        className="p-4"
        data={filteredHives}
        keyExtractor={(item) => item.hive_id}
        renderItem={renderHiveItem}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
      />

      <TouchableOpacity
        className="absolute bottom-40 right-6 bg-primary w-16 h-16 rounded-full justify-center items-center shadow-lg"
        onPress={navigateToCreateHive}
      >
        <Feather name="plus" size={28} color="white" />
      </TouchableOpacity>

      <HiveFilters
        isVisible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </LinearBackground>
  );
};

export default HiveListScreen;
