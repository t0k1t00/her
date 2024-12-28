import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import colors from '../styles/colors';
import typography from '../styles/typography';

// Get screen width dynamically
const { width } = Dimensions.get('window');

function ButtonPrimary({
  title,
  onPress,
  backgroundColor = 'primary',
  font = 'buttonPrimary',
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: colors[backgroundColor] }]}
      activeOpacity={0.7} // Added ripple effect on press for better UX
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
    width: width - 30, // Adjusted width with padding
    height: 60,
    marginTop: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Added for Android shadow support
  },
  buttonText: {
    textAlign: 'center', // Ensures text is centered properly
    color: colors.white, // Assuming white text color
  },
});

export default ButtonPrimary;
