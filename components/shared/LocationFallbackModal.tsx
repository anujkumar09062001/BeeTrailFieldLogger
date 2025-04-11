import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Modal from "react-native-modal";

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!;

interface LocationSuggestion {
  id: string;
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface LocationModalProps {
  isVisible: boolean;
  onLocationSelected: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  onClose?: () => void;
  hasExistingLocation?: boolean;
}

const LocationFallbackModal: React.FC<LocationModalProps> = ({
  isVisible,
  onLocationSelected,
  onClose,
  hasExistingLocation = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<MapView>(null);

  const handleModalBackdropPress = () => {
    if (hasExistingLocation && onClose) {
      onClose();
    }

    return;
  };

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchQuery.length > 2) {
      searchTimeout.current = setTimeout(() => {
        fetchPlaceSuggestions();
      }, 500);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  const fetchPlaceSuggestions = async () => {
    if (searchQuery.length < 3) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          searchQuery
        )}&key=${GOOGLE_PLACES_API_KEY}&types=geocode`
      );
      const data = await response.json();

      if (data.status === "OK") {
        setSuggestions(data.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching place suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const { lat, lng } = data.result.geometry.location;
        const address = data.result.formatted_address;

        return {
          latitude: lat,
          longitude: lng,
          address,
        };
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
    return null;
  };

  const handleSuggestionPress = async (suggestion: LocationSuggestion) => {
    const locationDetails = await getPlaceDetails(suggestion.place_id);

    if (locationDetails) {
      setSelectedLocation(locationDetails);
      setSearchQuery(locationDetails.address);
      setSuggestions([]);

      // Update map region
      setMapRegion({
        latitude: locationDetails.latitude,
        longitude: locationDetails.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Animate map to selected location
      mapRef.current?.animateToRegion({
        latitude: locationDetails.latitude,
        longitude: locationDetails.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelected(selectedLocation);
    }
  };

  const renderSuggestionItem = ({ item }: { item: LocationSuggestion }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-200"
      onPress={() => handleSuggestionPress(item)}
    >
      <Text className="text-base text-gray-800">
        {item.structured_formatting.main_text}
      </Text>
      <Text className="text-sm text-gray-500">
        {item.structured_formatting.secondary_text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.8}
      avoidKeyboard={true}
      style={{ margin: 0, justifyContent: "flex-end" }}
      onBackdropPress={handleModalBackdropPress}
      backdropTransitionOutTiming={0}
      onBackButtonPress={hasExistingLocation && onClose ? onClose : () => {}}
    >
      <View className="bg-white rounded-t-3xl p-5 h-4/5">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-bold text-gray-800 flex-1">
            {hasExistingLocation
              ? "Change Your Location"
              : "Enter Your Location"}
          </Text>

          {/* Close button only shown if user has an existing location */}
          {hasExistingLocation && onClose && (
            <TouchableOpacity onPress={onClose} className="p-1">
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-sm text-gray-500 mb-5">
          {hasExistingLocation
            ? "Update your location to see crops in a different area."
            : "To show relevant crops near you, please enter your location manually."}
        </Text>

        <View className="flex-row items-center mb-2">
          <TextInput
            className="flex-1 h-12 border border-gray-200 rounded-lg px-4 text-base bg-gray-50"
            placeholder="Search for your location"
            value={searchQuery}
            onChangeText={(value) => {
              setSearchQuery(value);
              setSelectedLocation(null);
            }}
            placeholderTextColor="#888"
          />
          {loading && (
            <ActivityIndicator style={{ position: "absolute", right: 15 }} />
          )}
        </View>

        {suggestions.length > 0 && !selectedLocation && (
          <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item) => item.place_id}
            className="max-h-48 border border-gray-100 rounded-lg"
          />
        )}

        {selectedLocation && (
          <View className="h-48 my-5 rounded-lg overflow-hidden">
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              region={mapRegion}
            >
              <Marker
                coordinate={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                }}
              />
            </MapView>
          </View>
        )}

        <TouchableOpacity
          className={`py-4 rounded-lg items-center mt-2 ${
            selectedLocation ? "bg-green-600" : "bg-green-200 opacity-70"
          }`}
          onPress={handleConfirmLocation}
          disabled={!selectedLocation}
        >
          <Text className="text-white text-base font-bold">
            {hasExistingLocation ? "Update Location" : "Confirm Location"}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default LocationFallbackModal;
