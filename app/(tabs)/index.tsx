import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCities } from "@/context/CityContext";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

/**
 * Interface for city time data structure
 * @interface CityTime
 * @property {string} id - Unique identifier for the city
 * @property {string} city - City name
 * @property {string} timezone - IANA timezone identifier
 * @property {string} time - Formatted time string (YYYY-MM-DD HH:mm:ss)
 */
interface CityTime {
  id: string;
  city: string;
  timezone: string;
  time: string;
}

/**
 * World Clock Screen Component
 * Displays real-time clocks for multiple cities with management options
 * @returns {JSX.Element} The world clock screen component
 */
export default function WorldClockScreen() {
  const { cities, removeCity } = useCities();
  const [times, setTimes] = useState<CityTime[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  /**
   * Toggles the dropdown menu for a specific city
   * @param {string} id - City ID to toggle menu for
   */
  const handleMenuPress = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  /**
   * Deletes a city from the world clock list
   * @param {string} id - City ID to delete
   */
  const handleDelete = (id: string) => {
    removeCity(id);
    setOpenMenuId(null);
  };

  /**
   * Effect hook to update times every second
   * Creates an interval that updates all city times based on their timezones
   */
  useEffect(() => {
    /**
     * Updates the time for all cities using their respective timezones
     * Uses Intl.DateTimeFormat for accurate timezone conversion
     */
    const updateTimes = () => {
      const now = new Date();
      const currentTimes = cities.map(({ id, city, timezone }) => {
        // Format time using Swedish locale for consistent YYYY-MM-DD HH:mm:ss format
        const timeInTimezone = new Intl.DateTimeFormat("sv-SE", {
          timeZone: timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);

        return {
          id,
          city,
          timezone,
          time: timeInTimezone.replace(" ", " "),
        };
      });
      setTimes(currentTimes);
    };

    // Initial update and set up interval for real-time updates
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [cities]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>it is my clock</ThemedText>
      {times.map(({ id, city, time }) => (
        <ThemedView key={id} style={styles.timeContainer}>
          <ThemedView style={styles.cityTimeWrapper}>
            <ThemedView style={styles.cityTimeContent}>
              <ThemedText style={styles.cityName}>{city}</ThemedText>
              <ThemedText style={styles.time}>{time}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.menuContainer}>
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => handleMenuPress(id)}
              >
                <ThemedText style={styles.menuDots}>⋯</ThemedText>
              </TouchableOpacity>
              {openMenuId === id && (
                <ThemedView style={styles.dropdown}>
                  <TouchableOpacity 
                    style={styles.dropdownItem}
                    onPress={() => handleDelete(id)}
                  >
                    <ThemedText style={styles.deleteText}>Delete</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              )}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      ))}

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
  },
  timeContainer: {
    alignItems: "center",
    marginBottom: 30,
    width: "100%",
  },
  cityTimeWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  cityTimeContent: {
    alignItems: "center",
  },
  cityName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  menuContainer: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  menuButton: {
    padding: 8,
  },
  dropdown: {
    position: "absolute",
    top: 36,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 100,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
    borderRadius: 8,
  },
  menuDots: {
    fontSize: 20,
    fontWeight: "bold",
  },
  time: {
    fontSize: 18,
    fontFamily: "monospace",
  },
  deleteText: {
    color: "#ff3b30",
    fontWeight: "600",
  },
});
