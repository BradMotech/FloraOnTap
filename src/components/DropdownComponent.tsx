import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
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

      {/* Modal to display dropdown items */}
      <Modal visible={isOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleItemSelect(item)} style={styles.dropdownItem}>
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={toggleDropdown}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    width: '100%',
    borderWidth: 0.3,
    borderColor: tokens.colors.gray,
    borderRadius: tokens.borderRadius.medium,
    marginBottom: 12,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacing.md,
  },
  dropdownText: {
    fontSize: tokens.fontSize.medium,
    color: tokens.colors.hairduTextColorGreen,
    fontWeight: '700',
  },
  icon: {
    marginLeft: tokens.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.borderRadius.medium,
    padding: tokens.spacing.md,
    maxHeight: 250, // Set a height limit for the modal
  },
  dropdownItem: {
    padding: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gray,
  },
  itemText: {
    fontSize: tokens.fontSize.medium,
    color: tokens.colors.barkInspiredTextColor,
  },
  closeButton: {
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.gray,
    alignItems: 'center',
    marginTop: tokens.spacing.md,
    borderRadius: tokens.borderRadius.small,
  },
  closeText: {
    color: tokens.colors.background,
    fontWeight: '700',
  },
});

export default DropdownComponent;
