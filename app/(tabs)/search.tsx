/**
 * Search Region Component
 * Allows users to search and manage cities in their world clock
 */
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCities } from "@/context/CityContext";
import { CITIES as DATA } from "@/data/cities";
import React, { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";

/**
 * Search Region Screen Component
 * Provides search functionality to find and add/remove cities from world clock
 * @returns {JSX.Element} The search region screen component
 */
export default function SearchRegion() {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(DATA);
  const colorScheme = useColorScheme();
  const { addCity, removeCity, cities } = useCities();

  /**
   * Checks if a city is already added to the world clock
   * @param {string} cityId - The ID of the city to check
   * @returns {boolean} True if city is already added, false otherwise
   */
  const isAdded = (cityId: string) => cities.some(c => c.id === cityId);

  /**
   * Handles search input and filters cities based on query
   * @param {string} text - Search query text
   */
  const handleSearch = (text: string) => {
    setQuery(text);
    // Filter cities by name (case-insensitive)
    const results = DATA.filter((item) =>
      item.city.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(results);
  };

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
