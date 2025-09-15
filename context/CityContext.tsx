import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

type City = { id: string; city: string; timezone: string };

type CityContextType = {
  cities: City[];
  addCity: (city: City) => void;
  removeCity: (id: string) => void;
};

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider = ({ children }: { children: React.ReactNode }) => {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("cities").then((data) => {
      if (data) setCities(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

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
  const removeCity = (id: string) =>
    setCities((prev) => prev.filter((c) => c.id !== id));

  return (
    <CityContext.Provider value={{ cities, addCity, removeCity }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCities = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error("useCities must be used inside CityProvider");
  return context;
};
