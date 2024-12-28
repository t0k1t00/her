import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../styles/colors';
import typography from '../styles/typography';
import { Entypo } from '@expo/vector-icons';

function Header({ title = 'Header', icon = 'menu', onPress = () => console.log('Icon pressed!') }) {
  return (
    <View style={styles.container}>
      <Text style={typography.navigation}>{title}</Text>
      <Entypo
        name={icon}
        color={colors.primary}
        size={24}
        onPress={onPress}
        style={styles.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: '100%',
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.background, // Optional: Set a background color for better visibility
    paddingHorizontal: 20, // Optional: Adjust spacing for responsiveness
  },
  icon: {
    position: 'absolute',
    right: 20,
  },
});

export default Header;
