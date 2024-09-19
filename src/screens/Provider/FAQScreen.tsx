import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const FAQS = [
  {
    id: 0,
    question: "How do I book an appointment with a salon?",
    answer: "To book an appointment, simply choose your preferred salon or hairstylist, select an available time, and confirm your booking.",
  },
  {
    id: 1,
    question: "Can I cancel or reschedule my booking?",
    answer: "Yes, you can cancel or reschedule your booking through the app before the appointment time. Just navigate to your appointments and choose the option.",
  },
  {
    id: 2,
    question: "What is the Hairdu app?",
    answer: "Hairdu is a convenient platform for customers to book hair services with salons and independent stylists. It helps manage bookings, payments, and much more.",
  },
  {
    id: 3,
    question: "Do I need to pay in advance?",
    answer: "Payment policies depend on the salon or stylist. Some may require a deposit, while others allow you to pay after the service is complete.",
  },
  {
    id: 4,
    question: "How can I contact customer support?",
    answer: "You can reach out to customer support via the in-app chat or by emailing support@hairdu.com.",
  },
  {
    id: 5,
    question: "What should I do if my stylist doesn't show up?",
    answer: "In case of a no-show, you can report the issue through the app, and we’ll assist you in resolving the situation.",
  },
  {
    id: 6,
    question: "Can I rate and review my stylist?",
    answer: "Yes, after your appointment, you will have the option to rate and leave a review for your stylist. This helps others in choosing the right service provider.",
  },
];

const FAQScreen = () => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setExpandedQuestion((prev) => (prev === id ? null : id)); // Toggle question expansion
  };

  const renderFAQ = ({ item }: { item: typeof FAQS[0] }) => (
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
    <View style={styles.container}>
      <FlatList
        data={FAQS}
        renderItem={renderFAQ}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
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
  faqContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  answerText: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
});

export default FAQScreen;
