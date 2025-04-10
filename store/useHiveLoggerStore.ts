import { asyncStorage } from "@/lib/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HiveEntry {
  hive_id: string;
  date_placed: string;
  num_colonies: number;
  latitude: number;
  longitude: number;
}

interface HiveLoggerState {
  hives: HiveEntry[];

  addHive: (hive: HiveEntry) => void;
  updateHive: (hiveId: string, hiveData: Partial<HiveEntry>) => boolean;
  removeHive: (hiveId: string) => boolean;
  getHiveById: (hiveId: string) => HiveEntry | undefined;
  getAllHives: () => HiveEntry[];
  clearAllHives: () => void;
}

export const useHiveLoggerStore = create<HiveLoggerState>()(
  persist(
    (set, get) => ({
      hives: [],

      addHive: (hive) => {
        set((state) => ({
          hives: [...state.hives, hive],
        }));
      },

      updateHive: (hiveId, hiveData) => {
        const { hives } = get();
        const hiveIndex = hives.findIndex((h) => h.hive_id === hiveId);

        if (hiveIndex === -1) return false;

        const updatedHives = [...hives];
        updatedHives[hiveIndex] = {
          ...updatedHives[hiveIndex],
          ...hiveData,
        };

        set({ hives: updatedHives });
        return true;
      },

      removeHive: (hiveId) => {
        const { hives } = get();
        const filteredHives = hives.filter((h) => h.hive_id !== hiveId);

        if (filteredHives.length === hives.length) return false;

        set({ hives: filteredHives });
        return true;
      },

      getHiveById: (hiveId) => {
        const { hives } = get();
        return hives.find((h) => h.hive_id === hiveId);
      },

      getAllHives: () => {
        return get().hives;
      },

      clearAllHives: () => {
        set({ hives: [] });
      },
    }),
    {
      name: "hive-logger-storage",
      storage: asyncStorage,
    }
  )
);
