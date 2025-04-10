import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { ScrollView, View } from "react-native";
import CustomTextInput from "@/components/core/CustomTextInput";
import CustomDatePicker from "@/components/core/CustomDatePicker";
import CustomLocationPicker, {
  LocationData,
} from "@/components/core/CustomLocationPicker";

interface HiveFormData {
  hive_id: string;
  num_colonies: number;
  date_placed: string; // ISO date string
  latitude: number;
  longitude: number;
}

interface HiveFormProps {
  initialData?: Partial<HiveFormData>;
  onSubmit: (data: HiveFormData) => void;
  onValidationError?: () => void;
}

interface HiveFormRef {
  submit: () => void;
}

const HiveForm = forwardRef<HiveFormRef, HiveFormProps>(
  ({ initialData, onSubmit, onValidationError }, ref) => {
    // Form state
    const [hiveId, setHiveId] = useState<string>(initialData?.hive_id || "");
    const [hiveIdError, setHiveIdError] = useState<string | undefined>();

    const [numberOfColonies, setNumberOfColonies] = useState<string>(
      initialData?.num_colonies?.toString() || "1"
    );
    const [coloniesError, setColoniesError] = useState<string | undefined>();

    const [dateOfPlacement, setDateOfPlacement] = useState<Date>(
      initialData?.date_placed ? new Date(initialData.date_placed) : new Date()
    );

    const [location, setLocation] = useState<LocationData | null>(
      initialData?.latitude && initialData?.longitude
        ? {
            latitude: initialData.latitude,
            longitude: initialData.longitude,
          }
        : null
    );
    const [locationError, setLocationError] = useState<string | undefined>();

    // Update form when initialData changes
    useEffect(() => {
      if (initialData) {
        setHiveId(initialData.hive_id || "");
        setNumberOfColonies(initialData.num_colonies?.toString() || "1");
        setDateOfPlacement(
          initialData.date_placed
            ? new Date(initialData.date_placed)
            : new Date()
        );
        setLocation(
          initialData.latitude && initialData.longitude
            ? {
                latitude: initialData.latitude,
                longitude: initialData.longitude,
              }
            : null
        );
      }
    }, [initialData]);

    const validateInputs = (): boolean => {
      let isValid = true;

      // Validate hive ID
      if (!hiveId.trim()) {
        setHiveIdError("Please enter a Hive ID");
        isValid = false;
      } else {
        setHiveIdError(undefined);
      }

      // Validate colonies
      const colonies = parseInt(numberOfColonies);
      if (isNaN(colonies) || colonies < 1) {
        setColoniesError("Please enter a valid number of colonies");
        isValid = false;
      } else {
        setColoniesError(undefined);
      }

      // Validate location
      if (!location) {
        setLocationError("Location is required");
        isValid = false;
      } else {
        setLocationError(undefined);
      }

      return isValid;
    };

    const handleSubmit = (): void => {
      // Validate inputs
      if (!validateInputs()) {
        onValidationError?.();
        return;
      }

      // Create hive data object
      const hiveData: HiveFormData = {
        hive_id: hiveId.trim(),
        num_colonies: parseInt(numberOfColonies),
        date_placed: dateOfPlacement.toISOString(),
        latitude: location!.latitude,
        longitude: location!.longitude,
      };

      // Submit the data
      onSubmit(hiveData);
    };

    // Expose the submit method via ref
    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    return (
      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <CustomTextInput
            label="Hive ID"
            placeholder="Enter hive identifier"
            value={hiveId}
            onChangeText={setHiveId}
            error={hiveIdError}
          />

          <CustomTextInput
            label="Number of Colonies"
            placeholder="1"
            value={numberOfColonies}
            onChangeText={setNumberOfColonies}
            keyboardType="numeric"
            error={coloniesError}
            containerClassName="mt-2"
          />

          <CustomDatePicker
            label="Date of Placement"
            value={dateOfPlacement}
            onChange={setDateOfPlacement}
            containerClassName="mt-2"
            maxDate={new Date()} // Can't place in the future
          />
        </View>

        <View className="bg-white rounded-lg shadow-sm p-4">
          <CustomLocationPicker
            label="Location"
            value={location}
            onChange={setLocation}
            error={locationError}
          />
        </View>
      </ScrollView>
    );
  }
);

export { HiveForm, type HiveFormData, type HiveFormRef };
