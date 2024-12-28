import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, Switch } from 'react-native';
import colors from '../styles/colors';
import typography from '../styles/typography';
import { Entypo } from '@expo/vector-icons';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/ButtonPrimary';
import Header from '../components/Header';
import Picture from '../components/Picture';
import avatar from '../assets/images/avatar.jpg';
import * as Animatable from 'react-native-animatable';

const db = getFirestore();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 70,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#7B6160',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  section: {
    width: '100%',
    height: 220,
    justifyContent: 'space-evenly',
    marginBottom: 0,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingLeft: 20,
    paddingRight: 10,
    height: 42,
    width: '100%',
  },
});

export default function Settings({ navigation }) {
  const [cycleLength, setCycleLength] = useState(0);
  const [lastStartDate, setLastStartDate] = useState('');
  const [periodLength, setPeriodLength] = useState(0);

  const fetchUserData = async () => {
    try {
      const userId = getAuth().currentUser.uid;
      const doc = await db.collection('users').doc(userId).get();

      if (doc.exists) {
        const data = doc.data();
        setCycleLength(data.cycleLength);
        setLastStartDate(data.lastStartDate);
        setPeriodLength(data.periodLength);

        // Optionally save to AsyncStorage
        await AsyncStorage.setItem('cycleLength', String(data.cycleLength));
        await AsyncStorage.setItem('lastStartDate', data.lastStartDate);
        await AsyncStorage.setItem('periodLength', String(data.periodLength));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const AnimationRef = useRef(null);

  const animation = () => {
    if (AnimationRef) {
      AnimationRef.current?.pulse();
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Inställningar"
        icon="cross"
        onPress={() => navigation.goBack()}
      />

      <Picture source={avatar} />

      <Animatable.View ref={AnimationRef}>
        <Button
          title="Spara din data i ett konto / Logga in"
          onPress={() => {
            animation();
          }}
        />
      </Animatable.View>

      <View style={styles.section}>
        <View style={styles.wrapper}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Entypo name="drop" color={colors.primary} size={26} />
            <Text style={[typography.h4, { marginLeft: 20 }]}>Menslängd</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={typography.p}>{periodLength} dagar</Text>
            <Entypo
              name="chevron-small-right"
              color={colors.primary}
              size={26}
            />
          </View>
        </View>

        <View style={styles.wrapper}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Entypo name="time-slot" color={colors.primary} size={26} />
            <Text style={[typography.h4, , { marginLeft: 20 }]}>
              Cykellängd
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={typography.p}>{cycleLength} dagar</Text>
            <Entypo
              name="chevron-small-right"
              color={colors.primary}
              size={26}
            />
          </View>
        </View>

        <View style={styles.wrapper}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Entypo name="flower" color={colors.primary} size={26} />
            <Text style={[typography.h4, , { marginLeft: 20 }]}>
              Fertilitet
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 5,
            }}
          >
            <Switch ios_backgroundColor={colors.secondary} />
          </View>
        </View>

        <View style={styles.wrapper}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Entypo name="rainbow" color={colors.primary} size={26} />
            <Text style={[typography.h4, , { marginLeft: 20 }]}>
              Få påminnelse
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 5,
            }}
          >
            <Switch ios_backgroundColor={colors.secondary} />
          </View>
        </View>
      </View>
      <StatusBar barStyle="dark-content" />
    </View>
  );
}
