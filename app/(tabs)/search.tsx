// Basic search region component
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCities } from "@/context/CityContext";
import React, { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";

const DATA = [
  { id: "1", city: "Seoul", country: "South Korea", timezone: "Asia/Seoul" },
  { id: "2", city: "New York", country: "USA", timezone: "America/New_York" },
  { id: "3", city: "London", country: "UK", timezone: "Europe/London" },
  { id: "4", city: "Tokyo", country: "Japan", timezone: "Asia/Tokyo" },
  {
    id: "5",
    city: "Vancouver",
    country: "Canada",
    timezone: "America/Vancouver",
  },
  { id: "6", city: "Toronto", country: "Canada", timezone: "America/Toronto" },
  {
    id: "7",
    city: "Sydney",
    country: "Australia",
    timezone: "Australia/Sydney",
  },
  { id: "8", city: "Paris", country: "France", timezone: "Europe/Paris" },
];

export default function SearchRegion() {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(DATA);
  const colorScheme = useColorScheme();
  const { addCity, removeCity, cities } = useCities();

  const isAdded = (cityId: string) => cities.some(c => c.id === cityId);

  /** Define function onSearch */
  const handleSearch = (text: string) => {
    setQuery(text);
    const results = DATA.filter((item) =>
      item.city.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(results);
  };

  //   console.log(colorScheme);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.inputLabel}>Search the region</ThemedText>
      <TextInput
        style={
          (styles.input,
          {
            color: colorScheme === "dark" ? "#fff" : "#000",
            backgroundColor: colorScheme === "dark" ? "#222" : "#fff",
          })
        }
        value={query}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.row}>
            <ThemedText style={styles.item}>{item.city}</ThemedText>
            <ThemedView style={styles.buttonContainer}>
              {!isAdded(item.id) ? (
                <Button title="Add" onPress={() => addCity(item)} />
              ) : (
                <Button title="Remove" color="red" onPress={() => removeCity(item.id)} />
              )}
            </ThemedView>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
    padding: 10,
    flex: 1,
  },
  buttonContainer: {
    minWidth: 80,
  },
});
