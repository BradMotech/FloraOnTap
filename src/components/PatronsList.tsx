import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import globalStyles from '../styles/globalStyles';
import tokens from '../styles/tokens';
import { getHairStylistPatrons, getUserPatrons } from '../firebase/dbFunctions';
import Badge from './Badge';

const PatronsListScreen = ({ uid, onSelectPatron }) => {
  const [patrons, setPatrons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatron, setSelectedPatron] = useState(null);

  // Function to fetch patrons from both collections
  const fetchPatrons = async () => {
    try {
      setLoading(true);

      // Fetch patrons from both Users and Hairstylists collections
      const userPatrons = await getUserPatrons(uid);
      const hairstylistPatrons = await getHairStylistPatrons(uid);

      // Combine patrons from both collections and remove duplicates
      const combinedPatrons = [...userPatrons, ...hairstylistPatrons];
      const uniquePatrons = Array.from(new Set(combinedPatrons.map(p => p.email))) // Remove duplicates based on email

      setPatrons(hairstylistPatrons);
    } catch (error) {
      console.error('Error fetching patrons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatrons();
  }, []);

  // Handle selecting a patron
  const handleSelectPatron = (patron) => {
    setSelectedPatron(patron);
    onSelectPatron(patron); // Send selected patron back to the parent
  };

  const renderPatron = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.patronContainer,
        selectedPatron?.email === item.email && styles.selectedPatron, // Highlight selected patron
      ]}
      onPress={() => handleSelectPatron(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.patronImage} />
      <View style={styles.patronDetails}>
        <Text style={styles.patronName}>{item.name}</Text>
        <Text style={styles.patronEmail}>{item.email}</Text>
        {selectedPatron?.email === item.email && <View
          style={{ alignItems: "flex-end", display: "flex" }}
        >
          <Badge text={"Selected Patron"} />
        </View>}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={tokens.colors.hairduMainColor} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={patrons}
        keyExtractor={(item) => item.email}
        renderItem={renderPatron}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No patrons found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "transparent",
    width: '100%',
  },
  patronContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    shadowColor: tokens.colors.bgFaint,
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: 0.7,
    elevation: 1.5,
    borderBottomWidth:0.4,
    borderBottomColor:tokens.colors.gray
  },
  selectedPatron: {
    borderColor:tokens.colors.hairduMainColor,
    borderWidth:0.4,
    shadowColor: tokens.colors.shadow,
    backgroundColor: tokens.colors.background, // Add a highlight color for selected patron
  },
  patronImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  patronDetails: {
    justifyContent: 'center',
    width:Dimensions.get('screen').width/1.6
  },
  patronName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: tokens.colors.barkInspiredTextColor,
     fontFamily:'GorditaMedium'
  },
  patronEmail: {
    fontSize: 14,
    color: tokens.colors.textColor,
    fontFamily:'GorditaRegular'
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: tokens.colors.text,
  },
});

export default PatronsListScreen;
