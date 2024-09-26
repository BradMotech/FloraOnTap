import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';

// Get screen width to adjust the column width dynamically
const { width } = Dimensions.get('window');

const MasonryFlatList = ({ data, renderItem, columnCount = 2, gap = 10 }) => {
  const [columns, setColumns] = useState([]);

  // Organize data into columns
  useEffect(() => {
    const createColumns = () => {
      let tempColumns = Array.from({ length: columnCount }, () => []);
      
      data.forEach((item, index) => {
        tempColumns[index % columnCount].push(item);
      });

      setColumns(tempColumns);
    };

    createColumns();
  }, [data, columnCount]);

  return (
    // <ScrollView contentContainerStyle={{ paddingHorizontal: gap / 2,height:'100%',width:'100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {columns.map((columnData, columnIndex) => (
          <View 
            key={`column_${columnIndex}`} 
            style={{ flex: 1, marginHorizontal: gap / 2 }}
          >
            {columnData.map((item, itemIndex) => (
              <View 
                key={`item_${itemIndex}`} 
                style={{ marginBottom: gap }}
              >
                {renderItem({ item, index: itemIndex })}
              </View>
            ))}
          </View>
        ))}
      </View>
    // </ScrollView>
  );
};

export default MasonryFlatList;
