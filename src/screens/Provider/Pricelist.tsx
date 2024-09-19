import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const PRICINGOPTIONS = [
  {
    id: 0,
    name: 'Free Plan - Trial',
    price: 0.0,
    features: ['10 credits pack', '2 appointment approval', 'Minimal Support'],
  },
  {
    id: 1,
    name: 'Basic Plan - 10% off',
    price: 439.99,
    features: ['20 credits pack', '4 appointment approval', '100MB Storage', 'Basic Support'],
  },
  {
    id: 2,
    name: 'Starter Plan - 15% off',
    price: 839.99,
    features: ['40 credits pack', '8 appointment approval', '1GB Storage', 'Priority Support'],
  },
  {
    id: 3,
    name: 'Business Plan - 20% off',
    price: 1499.99,
    features: [
      '80 credits pack',
      '16 appointment approval',
      'Chat system to manage appointment follow ups',
      'Financial projections',
      'Dedicated Support',
    ],
  },
];

const PriceList = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const handleSelectPlan = (id: number) => {
    setSelectedPlan(id);
  };

  const renderPlan = ({ item }: { item: typeof PRICINGOPTIONS[0] }) => (
    <TouchableOpacity
      style={[
        styles.planContainer,
        selectedPlan === item.id ? styles.selectedPlan : null,
      ]}
      onPress={() => handleSelectPlan(item.id)}
    >
      <Text style={styles.planTitle}>{item.name}</Text>
      <Text style={styles.planPrice}>R {item.price.toFixed(2)}</Text>
      <View style={styles.featuresContainer}>
        {item.features.map((feature, index) => (
          <Text key={index} style={styles.featureText}>
            • {feature}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={PRICINGOPTIONS.slice(0, 3)} // Limit to first 3 options
        renderItem={renderPlan}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      {selectedPlan !== null && (
        <Text style={styles.selectedText}>
          Selected Plan: {PRICINGOPTIONS[selectedPlan].name}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    paddingVertical: 10,
  },
  planContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  selectedPlan: {
    borderColor: '#007AFF',
    backgroundColor: '#e7f3ff',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
  },
  featuresContainer: {
    marginTop: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
});

export default PriceList;
