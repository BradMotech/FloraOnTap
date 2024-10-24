import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type FloatingActionButtonProps = {
  position: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  actions: { iconName: string; label: string; backgroundColor: string }[];
  pressChildButon:()=>void
};

const FAB = ({ position, actions,pressChildButon }: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle the FAB toggle
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Dynamic positioning of the FAB based on the position prop
  const fabPositionStyle = getPositionStyle(position);
  const labelPositionStyle = getLabelPositionStyle(position);

  return (
    <View style={[styles.container, fabPositionStyle]}>
      {/* Overlay behind the buttons when the FAB is open */}
      {isOpen && <View style={styles.overlay} />}

      {/* Render the additional action buttons if menu is open */}
      {isOpen &&
        actions.map((action, index) => (
          <View
            key={action.label}
            style={[
              styles.actionButton,
              { bottom: (index + 1) * 60 + 2 }, // Position each button above the main FAB
            ]}
          >
            <TouchableOpacity
            onPress={pressChildButon}
              style={[
                styles.actionButtonContent,
                { backgroundColor: action.backgroundColor }, // Use the action's backgroundColor
              ]}
            >
              <Ionicons name={action.iconName} size={24} color="#fff" />
            </TouchableOpacity>
            {/* Label next to the button */}
            {/* <Text style={[styles.actionLabel, labelPositionStyle]}>
              {action.label}
            </Text> */}
          </View>
        ))}

      {/* Main FAB button */}
      <TouchableOpacity onPress={toggleMenu} style={styles.fab}>
        <Ionicons name={isOpen ? 'close' : 'add'} size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

// Helper function to dynamically set the FAB's position
const getPositionStyle = (position: string) => {
  switch (position) {
    case 'bottomRight':
      return { bottom: 30, right: 30 };
    case 'bottomLeft':
      return { bottom: 30, left: 30 };
    case 'topRight':
      return { top: 30, right: 30 };
    case 'topLeft':
      return { top: 30, left: 30 };
    default:
      return { bottom: 30, right: 30 };
  }
};

// Helper function to dynamically set the label's position based on FAB position
const getLabelPositionStyle = (position: string) => {
  switch (position) {
    case 'bottomRight':
    case 'topRight':
      return { right: 70 }; // Position labels to the left of the action buttons
    case 'bottomLeft':
    case 'topLeft':
      return { left: 70 }; // Position labels to the right of the action buttons
    default:
      return { right: 70 };
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000, // Ensure it's above other elements
    alignItems: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  actionButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999, // Ensure action buttons are above the FAB
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  actionButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Add shadow for buttons
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  actionLabel: {
    position: 'absolute',
    color: '#000',
    fontSize: 14,
    paddingHorizontal: 4,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly transparent background for labels
    borderRadius: 5,
    zIndex: 1000,
  },
  overlay: {
    // ...StyleSheet.absoluteFillObject, // Cover the entire screen with the overlay
    // backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent overlay
    // zIndex: 500, // Behind the buttons but above the rest of the content
  },
});

export default FAB;
