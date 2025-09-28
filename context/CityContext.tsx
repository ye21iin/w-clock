/**
 * City Context Provider
 * Manages global state for world clock cities with persistence
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

/**
 * City data structure
 * @typedef {Object} City
 * @property {string} id - Unique identifier for the city
 * @property {string} city - City name
 * @property {string} timezone - IANA timezone identifier
 */
type City = { id: string; city: string; timezone: string };

/**
 * Context type definition for city management
 * @typedef {Object} CityContextType
 * @property {City[]} cities - Array of cities in the world clock
 * @property {Function} addCity - Function to add a new city
 * @property {Function} removeCity - Function to remove a city by ID
 * @property {Function} reorderCities - Function to reorder cities by index
 */
type CityContextType = {
  cities: City[];
  addCity: (city: City) => void;
  removeCity: (id: string) => void;
  reorderCities: (fromIndex: number, toIndex: number) => void;
};

const CityContext = createContext<CityContextType | undefined>(undefined);
const STORAGE_KEY = "cities";

/**
 * City Context Provider Component
 * Provides city management functionality with AsyncStorage persistence
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Context provider component
 */
export const CityProvider = ({ children }: { children: React.ReactNode }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((data) => {
        if (!isMounted || !data) return;
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) setCities(parsed);
        } catch (e) {
          console.warn("Failed to parse persisted cities:", e);
          void AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
        }
      })
      .catch((e) => {
        if (isMounted) console.warn("Failed to load cities:", e);
      })
      .finally(() => {
        if (isMounted) setIsHydrated(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cities)).catch((e) =>
      console.warn("Failed to persist cities:", e)
    );
  }, [cities, isHydrated]);

  /**
   * Adds a new city to the world clock
   * Shows toast notification for success or duplicate city
   * @param {City} city - City object to add
   */
  const addCity = (city: City) => {
    setCities((prev) => {
      const exists = prev.some((c) => c.id === city.id);
      if (exists) {
        Toast.show({
          type: "info",
          text1: "Already Added",
          text2: `${city.city} is already in your world clock`,
        });
        return prev;
      }
      Toast.show({
        type: "success",
        text1: "City Added",
        text2: `${city.city} added to world clock`,
      });
      return [...prev, city];
    });
  };

  /**
   * Removes a city from the world clock by ID
   * Shows toast notification when city is removed
   * @param {string} id - ID of the city to remove
   */
  const removeCity = (id: string) => {
    setCities((prev) => {
      const cityToRemove = prev.find((c) => c.id === id);
      if (cityToRemove) {
        Toast.show({
          type: "success",
          text1: "City Removed",
          text2: `${cityToRemove.city} removed from world clock`,
        });
      }
      return prev.filter((c) => c.id !== id);
    });
  };

  /**
   * Reorders cities in the world clock list
   * @param {number} fromIndex - Current index of the city
   * @param {number} toIndex - Target index for the city
   */
  const reorderCities = (fromIndex: number, toIndex: number) => {
    setCities((prev) => {
      if (fromIndex === toIndex || prev.length === 0) return prev;
      const len = prev.length;
      if (fromIndex < 0 || fromIndex >= len || toIndex < 0 || toIndex >= len)
        return prev;
      const next = [...prev];
      const [removed] = next.splice(fromIndex, 1);
      if (!removed) return prev;
      next.splice(toIndex, 0, removed);
      return next;
    });
  };

  return (
    <CityContext.Provider
      value={{ cities, addCity, removeCity, reorderCities }}
    >
      {children}
    </CityContext.Provider>
  );
};

/**
 * Custom hook to access city context
 * @returns {CityContextType} City context with cities array and management functions
 * @throws {Error} When used outside of CityProvider
 */
export const useCities = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error("useCities must be used inside CityProvider");
  return context;
};
