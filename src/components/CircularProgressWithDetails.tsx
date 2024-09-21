import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import tokens from "../styles/tokens";

const CircularProgressWithDetails = ({ user }) => {

  const { name, email, creditsLeft, totalCredits } = user;
  const radius = 80;
  const stroke = 16;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = (creditsLeft / totalCredits) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
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
            stroke={tokens.colors.hairduMainColor} // Progress bar color
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
            fontSize="15"
            fill="#333"
          >{creditsLeft}/  {totalCredits}
          </SvgText>
          {/* <SvgText
            x="50%"
            y="60%"
            alignmentBaseline="middle"
            textAnchor="middle"
            fontSize="14"
            fill="#555"
          >
            credits
          </SvgText> */}
        </Svg>
      </View>
      <View style={styles.userDetails}>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Name: </Text>
          <Text style={[styles.value,{maxWidth:20,overflow:'hidden',fontSize:12}]} numberOfLines={2} ellipsizeMode="tail">{name}</Text>
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Email: </Text>
          <Text style={[styles.value,{maxWidth:20,overflow:'hidden',fontSize:12}]} numberOfLines={2} ellipsizeMode="tail">{email}</Text>
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Credits Left: </Text>
          <Text style={[styles.value,{maxWidth:20,overflow:'hidden',fontSize:12}]} numberOfLines={2} ellipsizeMode="tail">{totalCredits-creditsLeft}</Text>
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Total Credits: </Text>
          <Text style={[styles.value,{maxWidth:20,overflow:'hidden',fontSize:12}]} numberOfLines={2} ellipsizeMode="tail">{totalCredits}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    elevation: 5,
    width: "100%",
  },
  progressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  userDetails: {
    fontSize: 11,
  },
  detailText: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    backgroundColor: "#e0f7fa",
    color: "#00796b",
    padding: 2,
    borderRadius: 5,
  },
});

export default CircularProgressWithDetails;
