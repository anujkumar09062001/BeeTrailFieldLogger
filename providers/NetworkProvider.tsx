import OfflineBanner from "@/components/core/OfflineBanner";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import React, { createContext, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NetworkContextType {
  isConnected: boolean | null;
  checkConnection: () => Promise<boolean>;
}

const NetworkContext = createContext<NetworkContextType>({
  isConnected: null,
  checkConnection: async () => false,
});

export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
  children: React.ReactNode;
}

export const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isOfflineBannerVisible, setIsOfflineBannerVisible] =
    useState<boolean>(false);

  const insets = useSafeAreaInsets();

  const handleConnectivityChange = (state: NetInfoState) => {
    setIsConnected(state.isConnected);
    if (state.isConnected === false) {
      setIsOfflineBannerVisible(true);
    } else {
      setIsOfflineBannerVisible(false);
    }
  };

  const checkConnection = async (): Promise<boolean> => {
    try {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
      if (state.isConnected === false) {
        setIsOfflineBannerVisible(true);
      } else {
        setIsOfflineBannerVisible(false);
      }
      return !!state.isConnected;
    } catch (error) {
      console.error("Error checking network connection:", error);
      setIsConnected(false);
      setIsOfflineBannerVisible(true);
      return false;
    }
  };

  useEffect(() => {
    checkConnection();

    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRetry = async () => {
    const isNowConnected = await checkConnection();
    if (isNowConnected) {
      setIsOfflineBannerVisible(false);
    }
  };

  return (
    <NetworkContext.Provider value={{ isConnected, checkConnection }}>
      <View
        style={{
          marginTop: isOfflineBannerVisible ? insets?.top : 0,
        }}
        className="flex-1 relative"
      >
        {isOfflineBannerVisible && (
          <OfflineBanner
            isVisible={isOfflineBannerVisible}
            onRetry={handleRetry}
          />
        )}
        {children}
      </View>
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
