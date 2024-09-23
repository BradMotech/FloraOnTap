import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import tokens from "../styles/tokens";
import ButtonComponent from "./buttonComponent";
import globalStyles from "../styles/globalStyles";

const CircularProgressWithDetails = ({ user,onRenewSubscription, onFinanceProjections }) => {
  const { name, email, creditsLeft, totalCredits } = user;
  const radius = 100;
  const stroke = 16;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = (creditsLeft / totalCredits) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.containerColumn}>
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <Svg height={radius * 2} width={radius * 2}>
            <Circle
              stroke="#e0e0e0"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <Circle
              stroke={tokens.colors.circularProgress} // Progress bar color
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset} // Move strokeDashoffset here
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeLinecap="round"
            />
            <SvgText
              x="50%"
              y="50%"
              alignmentBaseline="middle"
              textAnchor="end"
              fontSize="13"
              fill="#333"
            >{creditsLeft}/  {totalCredits}
            </SvgText>
            <SvgText
            x="50%"
            y="60%"
            alignmentBaseline="middle"
            textAnchor="middle"
            fontSize="12"
            fill={tokens.colors.circularProgress}
          >
            credits
          </SvgText>
          </Svg>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Name: </Text>
            <Text
              style={[
                styles.value,
                { maxWidth: 20, overflow: "hidden", fontSize: 12 },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {name}
            </Text>
          </Text>
          <Text style={styles.detailText} numberOfLines={2}
              ellipsizeMode="tail">
            <Text style={styles.label}>Email: </Text>
            <Text
              style={[
                styles.value,
                { maxWidth: 20, overflow: "hidden", fontSize: 12 },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {email}
            </Text>
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Credits Left: </Text>
            <Text
              style={[
                styles.value,
                { maxWidth: 20, overflow: "hidden", fontSize: 12 },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {totalCredits - creditsLeft}
            </Text>
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Total Credits: </Text>
            <Text
              style={[
                styles.value,
                { maxWidth: 20, overflow: "hidden", fontSize: 12 },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {totalCredits}
            </Text>
          </Text>
        </View>
      </View>
      <View style={styles.row}>
      <View style={{ width: Dimensions.get("screen").width / 2.7 }}>
        <ButtonComponent onPress={onRenewSubscription} marginTop={10} text={"Subscription"} />
      </View>
      <View style={{ width: Dimensions.get("screen").width / 2.7 }}>
        <ButtonComponent onPress={onFinanceProjections} buttonColor={tokens.colors.blackColor} marginTop={10} text={"Report"} />
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderColor: "#fff",
    borderWidth: 0.4,
    borderRadius: 16,
    width: "100%",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e0e0e0",
    borderWidth: 0.4,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#e6e1e6",
    shadowOffset: { width: 10, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 13,
    elevation: 0.8,
    width: "100%",
  },
  progressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  userDetails: {
    fontSize: 11,
    maxWidth:Dimensions.get('screen').width/2.2,
    overflow:'hidden'
  },
  detailText: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    // backgroundColor: "#e0f7fa",
    color: "#00796b",
    padding: 2,
    borderRadius: 15,
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    width:'100%'
  }
});

export default CircularProgressWithDetails;
