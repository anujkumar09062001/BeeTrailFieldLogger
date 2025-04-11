interface ILocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface IHiveEntry {
  hiveId: string;
  location: LocationData;
  dateOfPlacement: string;
  numberOfColonies: number;
}

interface IHiveLoggerState {
  hives: HiveEntry[];

  addHive: (hive: HiveEntry) => void;
  updateHive: (hiveId: string, hiveData: Partial<HiveEntry>) => boolean;
  removeHive: (hiveId: string) => boolean;
  getHiveById: (hiveId: string) => HiveEntry | undefined;
  getAllHives: () => HiveEntry[];
  clearAllHives: () => void;
}

interface ICustomTextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad";
  secureTextEntry?: boolean;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  maxLength?: number;
}

interface ICustomButtonProps {
  title?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger" | "link" | "icon";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  iconName?: string;
  iconPosition?: "left" | "right";
  className?: string;
  textClassName?: string;
}

interface ICustomDatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
  minDate?: Date;
  maxDate?: Date;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  pickerClassName?: string;
  errorClassName?: string;
}

interface ILocationPickerProps {
  label?: string;
  value: LocationData | null;
  onChange: (location: LocationData | null) => void;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
}

interface ILinearBackgroundProps {
  children: ReactNode;
  className?: string;
  bottomInsets?: boolean;
}
interface HiveEntry {
  hive_id: string;
  date_placed: string;
  num_colonies: number;
  latitude: number;
  longitude: number;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface Crop {
  id: string;
  name: string;
  flowering_start: string;
  flowering_end: string;
  location: GeoLocation;
  recommended_hive_density?: number;
  distance?: number;
}
