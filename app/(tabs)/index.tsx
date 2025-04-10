import CustomTextInput from "@/components/core/CustomTextInput";
import LinearBackground from "@/components/layout/LinearBackground";
import FilterIndicator from "@/components/screens/HiveListing/FilterIndicator";
import HiveFilters from "@/components/screens/HiveListing/HiveFilters";
import HiveUiCard from "@/components/shared/HiveUiCard";
import { useHiveLoggerStore } from "@/store/useHiveLoggerStore";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FilterOptions = {
  startDate: Date | null;
  endDate: Date | null;
  locationRadius: number | null;
  locationName: string;
};

const defaultFilters: FilterOptions = {
  startDate: null,
  endDate: null,
  locationRadius: null,
  locationName: "",
};

const HiveListScreen = () => {
  const allHives = useHiveLoggerStore((state) => state.getAllHives());
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const filteredHives = useMemo(() => {
    return allHives.filter((hive) => {
      if (filters.startDate && filters.endDate) {
        const hivePlacementDate = new Date(hive.date_placed);
        if (
          hivePlacementDate < filters.startDate ||
          hivePlacementDate > filters.endDate
        ) {
          return false;
        }
      }

      // Filter by location name - modified as we now store coordinates directly
      if (filters.locationName) {
        // Since we no longer have address stored directly, we'd need to
        // implement a reverse geocoding solution or store address separately
        // For now, skip this filter
        return true;
      }

      // Filter by location radius (simplified - would need actual coordinate calculations)
      if (filters.locationRadius && hive.latitude && hive.longitude) {
        // Implement proper distance calculation between current location and hive coordinates
        // For now, this is just a placeholder
        // In a real implementation, you would:
        // 1. Get user's current location
        // 2. Calculate distance between user location and hive coordinates
        // 3. Return true if distance <= filters.locationRadius
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
  }, [allHives, filters, searchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const navigateToCreateHive = () => {
    router.push("/create-hive");
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  const renderEmptyList = () => (
    <View className="flex-1 justify-center items-center p-6">
      <Feather name="inbox" size={64} color="#9ca3af" />
      <Text className="text-lg text-gray-100 font-medium mt-4 text-center">
        No hives found
      </Text>
      <Text className="text-gray-100 text-center mt-2">
        {filters.startDate || filters.locationName || filters.locationRadius
          ? "Try adjusting your filters"
          : "Tap the + button to add your first hive"}
      </Text>
    </View>
  );

  const renderHiveItem = ({ item }: ListRenderItemInfo<any>) => (
    <HiveUiCard hive={item} />
  );

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
            placeholder="Search hives..."
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
