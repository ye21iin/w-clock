// Basic search region component
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import { FlatList, StyleSheet, TextInput, useColorScheme } from "react-native";

const DATA = [
  { id: "1", name: "Seoul", country: "South Korea" },
  { id: "2", name: "New York", country: "USA" },
  { id: "3", name: "London", country: "UK" },
  { id: "4", name: "Tokyo", country: "Japan" },
];

export default function SearchRegion() {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(DATA);
  const colorScheme = useColorScheme();

  /** Define function onSearch */
  const handleSearch = (text: string) => {
    setQuery(text);
    const results = DATA.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
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
          <ThemedText style={styles.item}>{item.name}</ThemedText>
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
  item: {
    fontSize: 18,
    padding: 10,
  },
});
