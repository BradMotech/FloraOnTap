import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tokens from '../styles/tokens';

interface DropdownProps {
  items: string[]; // List of items to render
  placeholder?: string; // Placeholder text
  onItemSelected: (item: string) => void; // Callback when an item is selected
}

const DropdownComponent: React.FC<DropdownProps> = ({ items, placeholder = 'Select...', onItemSelected }) => {
  const [isOpen, setIsOpen] = useState(false); // Dropdown open/close state
  const [selectedItem, setSelectedItem] = useState<string | null>(null); // Track selected item

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemSelect = (item: string) => {
    setSelectedItem(item);
    setIsOpen(false); // Close dropdown after selection
    onItemSelected(item); // Call the callback
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownHeader} onPress={toggleDropdown}>
        <Text style={styles.dropdownText}>
          {selectedItem ? selectedItem : placeholder}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={tokens.colors.gray}
          style={styles.icon}
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownList}>
          <FlatList
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemSelect(item)} style={styles.dropdownItem}>
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    width: '100%',
    borderWidth: 0.3,
    borderColor: tokens.colors.gray,
    borderRadius: tokens.borderRadius.medium,
    marginBottom:12
    // backgroundColor: tokens.colors.background,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacing.md,
    // backgroundColor: tokens.colors.background,
  },
  dropdownText: {
    fontSize: tokens.fontSize.medium,
    color: tokens.colors.hairduTextColorGreen,
    fontWeight:'700'
  },
  icon: {
    marginLeft: tokens.spacing.sm,
  },
  dropdownList: {
    maxHeight: 150, // Restrict the dropdown height
    borderTopWidth: 0.3,
    borderTopColor: tokens.colors.gray,
  },
  dropdownItem: {
    padding: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gray,
  },
  itemText: {
    fontSize: tokens.fontSize.medium,
    color: tokens.colors.hairduTextColorGreen,
  },
});

export default DropdownComponent;
