import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../styles/colors';
import typography from '../styles/typography';
import ButtonPrimary from '../components/ButtonPrimary';
import ButtonSecondary from '../components/ButtonSecondary';
import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default function Start({ navigation }) {
  // Button and text animations
  const AnimationRef = useRef(null);

  const animation = () => {
    if (AnimationRef) {
      AnimationRef.current?.pulse();
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.Text animation="fadeInDown" style={typography.h1}>
        Välkommen
      </Animatable.Text>
      <Animatable.Text
        animation="fadeIn"
        delay={600}
        style={[typography.h5, { textAlign: 'center', marginTop: 30 }]}
      >
        Svara på några frågor och vi kommer att anpassa appen för dig.
      </Animatable.Text>
      <View style={{ bottom: 30, position: 'absolute' }}>
        <Animatable.View ref={AnimationRef} animation="fadeIn" delay={100}>
          <ButtonSecondary
            title="Logga in"
            backgroundColor="secondary"
            font="buttonSecondary"
            onPress={() => {
              animation();
            }}
          />
        </Animatable.View>
        <Animatable.View ref={AnimationRef} animation="fadeIn" delay={100}>
          <ButtonPrimary
            title="Kom igång"
            onPress={() => {
              animation();
              setTimeout(() => {
                navigation.navigate('LatestStartDate');
              }, 700);
            }}
          />
        </Animatable.View>
      </View>
    </View>
  );
}
