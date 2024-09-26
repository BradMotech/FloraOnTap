import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import AddPatronScreen from '../../components/AddPatrons';
import globalStyles from '../../styles/globalStyles';
import tokens from '../../styles/tokens';

const Patrons = () => {
    return (
        <SafeAreaView  style={[globalStyles.safeArea,{marginTop:tokens.spacing.lg * 2.4}]}>
        <View>
            <AddPatronScreen/>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Patrons;
