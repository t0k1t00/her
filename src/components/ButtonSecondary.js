import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import colors from '../styles/colors';
import typography from '../styles/typography';

// Get screen width dynamically
const { width } = Dimensions.get('window');

function ButtonSecondary({
  title,
  onPress,
  backgroundColor = 'primary',
  font = 'buttonPrimary',
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[backgroundColor] }]}
      onPress={onPress}
      activeOpacity={0.7} // Adds a ripple effect on press for better UX
    >
      <Text style={[typography[font], styles.buttonText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 30, // Reduced width with padding
    height: 60,
    marginTop: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#E92206',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5, // Added for Android shadow support
  },
  buttonText: {
    textAlign: 'center', // Ensures text is centered properly
    color: colors.white, // Assuming white text color is needed
  },
});

export default ButtonSecondary;
