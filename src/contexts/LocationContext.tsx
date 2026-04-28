import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';

type LocationContextData = {
  userLocation: Location.LocationObject | null;
  locationError: string | null;
  isLoadingLocation: boolean;
  refreshLocation: () => Promise<void>;
};

const LocationContext = createContext<LocationContextData>({} as LocationContextData);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const requestAndGetLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permissão de localização negada.');
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation(location);
      setLocationError(null);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      setLocationError('Não foi possível obter a localização.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    requestAndGetLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        locationError,
        isLoadingLocation,
        refreshLocation: requestAndGetLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation deve ser usado dentro de um LocationProvider');
  }
  return context;
}
