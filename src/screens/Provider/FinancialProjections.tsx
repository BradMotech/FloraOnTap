import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import D3Charts from "../../components/D3Charts";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { AuthContext } from '../../auth/AuthContext';
import LoadingScreen from '../../components/LoadingScreen';
import ButtonComponent from '../../components/buttonComponent';
import tokens from '../../styles/tokens';
import globalStyles from '../../styles/globalStyles';

const FinancialProjections = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) return;

      try {
        // Fetch weekly metrics
        const weeklyMetricsRef = collection(db, 'weeklyMetrics');
        const weeklyQuery = query(weeklyMetricsRef, where('providerId', '==', user?.uid));
        const weeklySnapshot = await getDocs(weeklyQuery);

        const weeklyMap = new Map<string, number>();
        weeklySnapshot.docs.forEach(doc => {
          const label = doc.data().label;
          const value = doc.data().value;

          // Ensure value is treated as a number
          weeklyMap.set(label, (weeklyMap.get(label) || 0) + (typeof value === 'number' ? value : 0));
        });

        // Define day order
        const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Sort weekly data
        const sortedWeeklyData = Array.from(weeklyMap.entries())
          .map(([label, value]) => ({ label, value }))
          .sort((a, b) => dayOrder.indexOf(a.label) - dayOrder.indexOf(b.label));

        setWeeklyData(sortedWeeklyData);

        // Fetch monthly metrics
        const monthlyMetricsRef = collection(db, 'monthlyMetrics');
        const monthlyQuery = query(monthlyMetricsRef, where('providerId', '==', user?.uid));
        const monthlySnapshot = await getDocs(monthlyQuery);

        const monthlyMap = new Map<string, number>();
        monthlySnapshot.docs.forEach(doc => {
          const label = doc.data().label.trim();
          const value = doc.data().value;

          // Ensure value is treated as a number
          monthlyMap.set(label, (monthlyMap.get(label) || 0) + (typeof value === 'number' ? value : 0));
        });

        // Define month order with case-insensitive labels
        const monthOrder = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        // Sort monthly data
        const sortedMonthlyData = Array.from(monthlyMap.entries())
          .map(([label, value]) => ({
            label: label.charAt(0).toUpperCase() + label.slice(1).toLowerCase(), // Capitalize first letter of each month for consistency
            value
          }))
          .sort((a, b) => monthOrder.indexOf(a.label) - monthOrder.indexOf(b.label));

        setMonthlyData(sortedMonthlyData);

      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  const handlePrint = () => {
    console.log('Print button clicked!');
    // Implement actual print logic here
  };

  return !isLoading ? (
    <SafeAreaView style={[globalStyles.safeArea, { marginTop: tokens.spacing.lg * 2.4 }]}>
      <ScrollView style={styles.container}>
        <ButtonComponent buttonColor={tokens.colors.blackColor} text="Print projections" onPress={handlePrint} />
        <D3Charts timeFrame='days' data={weeklyData} title="Weekly Projections" />
        <D3Charts timeFrame='months' data={monthlyData} title="Monthly Projections" />
      </ScrollView>
    </SafeAreaView>
  ) : (
    <LoadingScreen />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});
export default FinancialProjections;

