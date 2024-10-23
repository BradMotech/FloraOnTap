import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import globalStyles from "../../styles/globalStyles";
import tokens from "../../styles/tokens";

const FAQS = [
  {
    id: 0,
    question: "How do I purchase flowers on FloraOnTap?",
    answer:
      "To purchase flowers, browse through our wide selection, add your favorite items to the cart, and proceed to checkout for a seamless payment process.",
  },
  {
    id: 1,
    question: "Can I cancel or modify my flower order?",
    answer:
      "Yes, you can cancel or modify your flower order before it's shipped. Just go to your order history and select the option.",
  },
  {
    id: 2,
    question: "What is FloraOnTap?",
    answer:
      "FloraOnTap is a convenient platform for buying flowers online. We offer a wide range of beautiful flowers, including bouquets, potted plants, and special arrangements for all occasions.",
  },
  {
    id: 3,
    question: "Do I need to pay in advance?",
    answer:
      "Yes, all purchases must be paid for in advance to confirm your order. We offer a variety of secure payment options.",
  },
  {
    id: 4,
    question: "How can I contact customer support?",
    answer:
      "You can contact customer support through the in-app chat or by emailing support@floraontap.com. We're here to assist you with any questions or issues.",
  },
  {
    id: 5,
    question: "What should I do if my flowers don't arrive?",
    answer:
      "If your flowers don't arrive on time, please contact customer support immediately, and we'll help resolve the issue as quickly as possible.",
  },
  {
    id: 6,
    question: "Can I rate and review my purchase?",
    answer:
      "Yes, after receiving your order, you can rate and leave a review for the flowers and the service. Your feedback helps us improve and helps others choose the perfect flowers.",
  },
];


const FAQScreen = () => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setExpandedQuestion((prev) => (prev === id ? null : id)); // Toggle question expansion
  };

  const renderFAQ = ({ item }: { item: (typeof FAQS)[0] }) => (
    <TouchableOpacity
      style={styles.faqContainer}
      onPress={() => handleToggle(item.id)}
    >
      <Text style={styles.questionText}>{item.question}</Text>
      {expandedQuestion === item.id && (
        <Text style={styles.answerText}>{item.answer}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[globalStyles.safeArea, { marginTop: tokens.spacing.lg * 2.4 }]}
    >
      <View style={styles.container}>
        <FlatList
          data={FAQS}
          renderItem={renderFAQ}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  listContainer: {
    paddingVertical: 10,
  },
  faqContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    fontFamily: "GorditaMedium",
  },
  answerText: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
    fontFamily: "GorditaLight",
  },
});

export default FAQScreen;
