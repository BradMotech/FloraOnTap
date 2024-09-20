// src/styles/globalStyles.ts
import { Dimensions, StyleSheet } from "react-native";
import tokens from "./tokens";

const { width, height } = Dimensions.get("window"); // Get device dimensions

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: tokens.colors.background,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: tokens.colors.hairduMainColor,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    fontSize: tokens.fontSize.large,
    fontWeight: "bold",
    color: tokens.colors.text,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: tokens.borderRadius.large,
  },
  button: {
    padding: tokens.spacing.sm,
    backgroundColor: tokens.colors.secondary,
    borderRadius: tokens.borderRadius.medium,
  },
  buttonText: {
    color: "#fff",
    fontSize: tokens.fontSize.medium,
  },
  spacing: {
    padding: tokens.spacing.sm,
  },
  headerColor: {
    backgroundColor: tokens.colors.hairduMainColor,
  },
  containerCard: {
    height: null,
    width: width * 0.86,
    marginHorizontal: width * 0.05, // 5% margin on both sides
    borderRadius: tokens.borderRadius.large,
    backgroundColor: tokens.colors.background,
    shadowColor: tokens.colors.shadow, // Shadow color for iOS
    shadowOffset: { width: 0, height: 5 }, // Shadow offset for iOS
    shadowOpacity: 0.25, // Shadow opacity for iOS
    shadowRadius: 10, // Shadow blur radius for iOS
    elevation: 5, // Shadow for Android
    padding: tokens.spacing.lg,
    maxHeight: height * 0.65,
    // minHeight:height * 0.5
  },
  alignCenter: {
    alignItems: "center",
  },
  textAlignCenter: {
    alignItems: "center",
    textAlign: "center",
    width: "100%",
  },
  welcomeText: {
    color: tokens.colors.hairduTextColorGreen,
    alignItems: "center",
    textAlign: "center",
    width: "100%",
    fontSize: tokens.fontSize.larger,
    marginTop: tokens.spacing.xl,
  },
  imageView: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.spacing.xl,
  },
  buttonWrapper: {
    width: "100%",
    height: 45,
    backgroundColor: tokens.colors.hairduMainColor,
    borderRadius: tokens.borderRadius.medium,
    textAlign: "center",
    justifyContent: "center",
  },
  buttonTextColor: {
    color: tokens.colors.background,
    textAlign: "center",
    justifyContent: "center",
    fontWeight: "600",
  },
  inputError: {
    borderColor: tokens.colors.error, // Red border for error state
  },
  inputIcon: {
    marginRight: tokens.spacing.sm, // Space between icon and text
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderWidth: 0.3,
    borderRadius: tokens.borderRadius.small,
    backgroundColor: tokens.colors.background,
    paddingHorizontal: tokens.spacing.sm,
    marginVertical: tokens.spacing.sm,
  },

  inputField: {
    flex: 1,
    height: "100%",
    paddingLeft: 40, // Adjust based on icon size and spacing
    fontSize: tokens.fontSize.medium,
    color: tokens.colors.text,
  },
  subtitle: {
    color: tokens.colors.gray,
    textAlign: "center",
    justifyContent: "center",
    fontWeight: "600",
  },
  calendar: {
    marginBottom: 20,
  },
  agenda: {
    flex: 1,
  },
  itemCalendarRender: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  bookingContainer: {
    marginTop: 20,
    padding: 10,
    alignItems: "center",
  },
  scroll: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: tokens.colors.background,
    minHeight: "100%",
  },
  Storycontainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    margin: 5,
  },
  StorySvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  StoryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    resizeMode: "cover",
  },
  storyContainerHorizontal: {
    flexDirection: "row", // Align children horizontally
    alignItems: "center", // Center items vertically
  },
  dashboard: {
    padding: 2,
  },
  separatorNoColor: {
    height: tokens.spacing.md,
  },
  gridContainer: {
    // paddingHorizontal: 10,
    display: "flex",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  scrollInCardContainer: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: tokens.colors.background,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Or 'contain', depending on your needs
  },
  value: {
    backgroundColor: "#e0f7fa",
    color: "#00796b",
    padding: 2,
    borderRadius: 5,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.hairduMainColor, // Placeholder background color
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 20,
    color: "#fff", // Text color for the placeholder
  },
  forgotPassword: {
    marginTop: 14,
    alignItems: "baseline",
    justifyContent: "center",
  },
  forgotPasswordClickHere: {
    color: "#007AFF",
    // alignItems: "center",
    // justifyContent: "center",
    // position: "absolute",
    // bottom: -3,
  },
});

export default globalStyles;
