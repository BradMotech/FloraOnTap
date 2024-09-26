// components/Tab.js
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Tab = ({ titles, activeTab, onTabPress }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.tabContainer}
    >
      {titles.map((title) => (
        <TouchableOpacity 
          key={title} 
          onPress={() => onTabPress(title)} 
          style={[styles.tab, activeTab === title && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === title && styles.activeTabText]}>
            {title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
  },
  tab: {
    padding: 16,
    alignItems: 'center',
    paddingLeft: 18,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTabText: {
    color: '#000',
  },
});

export default Tab;
