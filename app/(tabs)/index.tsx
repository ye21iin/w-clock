import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCities } from "@/context/CityContext";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

interface CityTime {
  id: string;
  city: string;
  timezone: string;
  time: string;
}

export default function WorldClockScreen() {
  const { cities } = useCities();
  const [times, setTimes] = useState<CityTime[]>([]);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const currentTimes = cities.map(({ id, city, timezone }) => {
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

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [cities]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>it is my clock</ThemedText>
      {times.map(({ id, city, time }) => (
        <ThemedView key={id} style={styles.timeContainer}>
          <ThemedText style={styles.cityName}>{city}</ThemedText>
          <ThemedText style={styles.time}>{time}</ThemedText>
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
  },
  cityName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  time: {
    fontSize: 18,
    fontFamily: "monospace",
  },
});
