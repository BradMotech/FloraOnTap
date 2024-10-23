import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Modal } from 'react-native';

// Sample data for filtering
const PROVINCES = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Limpopo'];
const LOCATIONS = ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Polokwane'];

const CATEGORIES = [
  { name: "Roses", id: 1 }, // Major
  { name: "Tulips", id: 2 }, // Minor
  { name: "Lilies", id: 3 }, // Major
  { name: "Daisies", id: 4 }, // Minor
  { name: "Sunflowers", id: 5 }, // Major
  { name: "Orchids", id: 6 }, // Major
  { name: "Hydrangeas", id: 7 }, // Major
  { name: "Peonies", id: 8 }, // Major
  { name: "Carnations", id: 9 }, // Minor
  { name: "Chrysanthemums", id: 10 }, // Minor
  { name: "Gardenias", id: 11 }, // Major
  { name: "Iris", id: 12 }, // Major
  { name: "Lavender", id: 13 }, // Major
  { name: "Daffodils", id: 14 }, // Minor
  { name: "Geraniums", id: 15 }, // Minor
  { name: "Marigolds", id: 16 }, // Minor
  { name: "Petunias", id: 17 }, // Minor
  { name: "Begonias", id: 18 }, // Minor
  { name: "Violets", id: 19 }, // Minor
  { name: "Snapdragons", id: 20 }, // Major
  { name: "Hibiscus", id: 21 }, // Major
  { name: "Anemones", id: 22 }, // Major
  { name: "Azaleas", id: 23 }, // Major
  { name: "Camellias", id: 24 }, // Major
  { name: "Ranunculus", id: 25 }, // Major
  { name: "Bluebells", id: 26 }, // Minor
  { name: "Clematis", id: 27 }, // Major
  { name: "Freesias", id: 28 }, // Major
  { name: "Hellebores", id: 29 }, // Major
  { name: "Pansies", id: 30 }, // Minor
  { name: "Zinnias", id: 31 }, // Minor
  { name: "Calendulas", id: 32 }, // Minor
  { name: "Cosmos", id: 33 }, // Minor
  { name: "Sweet Peas", id: 34 }, // Minor
  { name: "Foxgloves", id: 35 }, // Major
  { name: "Amaryllis", id: 36 }, // Major
  { name: "Poppies", id: 37 }, // Major
  { name: "Delphiniums", id: 38 }, // Major
  { name: "Dahlias", id: 39 }, // Major
  { name: "Gladiolus", id: 40 }, // Major
  { name: "Morning Glories", id: 41 }, // Minor
  { name: "Primroses", id: 42 }, // Minor
];

const FilterBy = ({ onApplyFilter }: { onApplyFilter: (filters: any) => void }) => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const toggleCategory = (id: number) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories((prev) => prev.filter((catId) => catId !== id));
    } else {
      setSelectedCategories((prev) => [...prev, id]);
    }
  };

  const handleApplyFilter = () => {
    const filters = {
      province: selectedProvince,
      location: selectedLocation,
      categories: selectedCategories,
    };
    onApplyFilter(filters); // Callback to pass filters to the parent component
  };

  const renderDropdown = (items: string[], selectedItem: string | null, onSelect: (item: string) => void, isDropdownOpen: boolean, setDropdownOpen: (open: boolean) => void) => (
    <>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setDropdownOpen(!isDropdownOpen)}>
        <Text style={styles.dropdownButtonText}>{selectedItem || "Select an Option"}</Text>
      </TouchableOpacity>
      {isDropdownOpen && (
        <View style={styles.dropdownMenu}>
          {items.map((item) => (
            <TouchableOpacity key={item} style={styles.dropdownItem} onPress={() => { onSelect(item); setDropdownOpen(false); }}>
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Filter By</Text>

      {/* Filter by Province */}
      {/* <Text style={styles.filterLabel}>Province</Text>
      {renderDropdown(PROVINCES, selectedProvince, setSelectedProvince, isProvinceDropdownOpen, setIsProvinceDropdownOpen)} */}

      {/* Filter by Location */}
      {/* <Text style={styles.filterLabel}>Location</Text>
      {renderDropdown(LOCATIONS, selectedLocation, setSelectedLocation, isLocationDropdownOpen, setIsLocationDropdownOpen)} */}

      {/* Filter by Categories */}
      <Text style={styles.filterLabel}>Categories</Text>
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.checkboxContainer}
          onPress={() => toggleCategory(category.id)}
        >
          <View style={[styles.checkbox, selectedCategories.includes(category.id) && styles.checked]}>
            {selectedCategories.includes(category.id) && <Text style={styles.checkmark}>✔</Text>}
          </View>
          <Text style={styles.categoryLabel}>{category.name}</Text>
        </TouchableOpacity>
      ))}

      {/* Apply Filter Button */}
      <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilter}>
        <Text style={styles.applyButtonText}>Apply Filters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#555',
  },
  dropdownButton: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007bff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 18,
  },
  categoryLabel: {
    fontSize: 16,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default FilterBy;
