import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface CityTime {
  city: string;
  timezone: string;
  time: string;
}

export default function WorldClockScreen() {
  const [times, setTimes] = useState<CityTime[]>([]);

  const cities = [
    { city: "Sydney", timezone: "Australia/Sydney" },
    { city: "Seoul", timezone: "Asia/Seoul" },
    { city: "Toronto", timezone: "America/Toronto" },
    { city: "Vancouver", timezone: "America/Vancouver" },
  ];

  const updateTimes = () => {
    const now = new Date();
    const currentTimes = cities.map(({ city, timezone }) => {
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
        city,
        timezone,
        time: timeInTimezone.replace(" ", " "),
      };
    });
    setTimes(currentTimes);
  };

  useEffect(() => {
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>세세계시계</Text>
      {times.map(({ city, time }) => (
        <View key={city} style={styles.timeContainer}>
          <Text style={styles.cityName}>{city}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  timeContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  cityName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  time: {
    fontSize: 18,
    fontFamily: "monospace",
    color: "#333",
  },
});
