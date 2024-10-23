import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import tokens from "../styles/tokens";
import ButtonComponent from "./buttonComponent";
import Badge from "./Badge";
import { PRICINGOPTIONS } from "../screens/Provider/Pricelist";
import globalStyles from "../styles/globalStyles";

const CircularProgressWithDetails = ({
  user,
  onRenewSubscription,
  onFinanceProjections,
  onLinkMerchantAccount
}) => {
  const { name, email, subscription,merchant } = user;

  const userPlan = PRICINGOPTIONS.find(
    (plan) => plan.name === subscription?.plan
  );
  const totalCredits = subscription?.totalCredits;
  const creditsLeft = totalCredits - subscription?.totalCreditsUsed;

  const radius = 100;
  const stroke = 16;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = (subscription?.totalCreditsUsed / totalCredits) * 100;

  // Ensure progress is valid
  const safeProgress =
    isNaN(progress) || progress < 0 ? 0 : progress > 100 ? 100 : progress;
  const animatedProgress = useRef(new Animated.Value(safeProgress)).current;

  const animatedStrokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
    extrapolate: "clamp",
  });

  const strokeColor = animatedProgress.interpolate({
    inputRange: [0, 70, 100],
    outputRange: [
      tokens.colors.circularProgress, // Default color for low progress
      tokens.colors.circularProgress, // Default color for medium progress
      creditsLeft === totalCredits ? "green" : "red", // Green if credits are full, red otherwise
    ],
    extrapolate: "clamp",
  });

  useEffect(() => {
    console.warn(subscription);
    Animated.timing(animatedProgress, {
      toValue: safeProgress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [safeProgress]);

  return (
    <View style={styles.containerColumn}>
      <Text
        style={[
          globalStyles.subtitle,
          { marginTop: tokens.spacing.md, marginBottom: tokens.spacing.md },
        ]}
      >
        {
          "To begin receiving payments, please configure your payment settings and link your preferred merchant account. Once done linking your merchant account, configure your subscription by clicking the subscription button below. "
        }
        <Text
          style={{ color: tokens.colors.skyBlueColor }}
          onPress={onLinkMerchantAccount}
        >
          {"Click here"}
        </Text>
        {" to get started."}
      </Text>
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
            <AnimatedCircle
              stroke={strokeColor}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={animatedStrokeDashoffset}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeLinecap="round"
            />
            <SvgText
              x="70%"
              y="50%"
              alignmentBaseline="middle"
              textAnchor="end"
              fontSize="13"
              fill="#333"
            >
              {`${
                isNaN(subscription?.totalCreditsUsed)
                  ? 0
                  : subscription?.totalCreditsUsed
              } / ${totalCredits} credits`}
            </SvgText>
          </Svg>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Credits Used: </Text>
            {subscription?.totalCreditsUsed && (
              <Text style={styles.value}>{subscription?.totalCreditsUsed}</Text>
            )}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Credits Left: </Text>
            {totalCredits !== creditsLeft ? (
              <Text style={styles.value}>
                {totalCredits -
                  (isNaN(subscription?.totalCreditsUsed)
                    ? 0
                    : subscription?.totalCreditsUsed)}
              </Text>
            ) : (
              <Text style={styles.value}>{totalCredits}</Text>
            )}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Total Credits: </Text>
            <Text style={styles.value}>{totalCredits}</Text>
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Payment: </Text>
            <Text style={styles.value}>{merchant?.paymentType}</Text>
          </Text>
          <Badge variant="noIcon" text={subscription?.plan} />
        </View>
      </View>
      <View style={styles.row}>
        <View style={{ width: Dimensions.get("screen").width / 2.2 }}>
          <ButtonComponent
            buttonColor={tokens.colors.hairduTextColorGreen}
            onPress={onRenewSubscription}
            marginTop={10}
            text={"Subscription"}
          />
        </View>
        <View style={{ width: Dimensions.get("screen").width / 2.2 }}>
          <ButtonComponent
            onPress={onFinanceProjections}
            buttonColor={tokens.colors.background}
            borderColor={tokens.colors.hairduTextColorGreen}
            textColor={tokens.colors.darkBlueColor}
            borderWidth={0.3}
            marginTop={10}
            text={"Report"}
          />
        </View>
      </View>
    </View>
  );
};

// Create an animated version of Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

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
    maxWidth: Dimensions.get("screen").width / 2.4,
    overflow: "hidden",
  },
  detailText: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    color: "#00796b",
    padding: 2,
    borderRadius: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
});

export default CircularProgressWithDetails;
