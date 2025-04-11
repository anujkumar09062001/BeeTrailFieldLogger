import { asyncStorage } from "@/lib/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: number;
}

interface LocationState {
  userLocation: Location | null;
  locationPermissionStatus: "granted" | "denied" | "undetermined";
  isManuallyEntered: boolean;

  setUserLocation: (location: Location) => void;
  clearUserLocation: () => void;
  setLocationPermissionStatus: (
    status: "granted" | "denied" | "undetermined"
  ) => void;
  setIsManuallyEntered: (isManual: boolean) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      userLocation: null,
      locationPermissionStatus: "undetermined",
      isManuallyEntered: false,

      setUserLocation: (location: Location) =>
        set({
          userLocation: {
            ...location,
            timestamp: location.timestamp || Date.now(),
          },
        }),

      clearUserLocation: () => set({ userLocation: null }),

      setLocationPermissionStatus: (
        status: "granted" | "denied" | "undetermined"
      ) => set({ locationPermissionStatus: status }),

      setIsManuallyEntered: (isManual: boolean) =>
        set({ isManuallyEntered: isManual }),
    }),
    {
      name: "location-storage",
      storage: asyncStorage,
    }
  )
);

export const isLocationStale = (location: Location | null): boolean => {
  if (!location || !location.timestamp) return true;

  const ONE_HOUR = 60 * 60 * 1000;
  const now = Date.now();

  return now - location.timestamp > ONE_HOUR;
};
