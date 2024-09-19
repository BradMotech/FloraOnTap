import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Modal } from 'react-native';

// Sample data for filtering
const PROVINCES = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Limpopo'];
const LOCATIONS = ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Polokwane'];
const CATEGORIES = [
  { id: 1, name: 'Braids' },
  { id: 2, name: 'Straightback' },
  { id: 3, name: 'Faux Locs' },
  { id: 4, name: 'Cornrows' },
  { id: 5, name: 'Dreadlocks' },
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
      <Text style={styles.filterLabel}>Province</Text>
      {renderDropdown(PROVINCES, selectedProvince, setSelectedProvince, isProvinceDropdownOpen, setIsProvinceDropdownOpen)}

      {/* Filter by Location */}
      <Text style={styles.filterLabel}>Location</Text>
      {renderDropdown(LOCATIONS, selectedLocation, setSelectedLocation, isLocationDropdownOpen, setIsLocationDropdownOpen)}

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
