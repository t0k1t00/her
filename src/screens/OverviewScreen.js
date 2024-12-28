import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';
import colors from '../styles/colors';
import typography from '../styles/typography';
import ButtonPrimary from '../components/ButtonPrimary';
import Header from '../components/Header';
import * as Animatable from 'react-native-animatable';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDays } from 'date-fns';
import moment from 'moment';
moment().format();

// Firebase configuration (replace with your Firebase config)
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 70,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#7B6160',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});

// Main Component
export default function Overview({ navigation }) {
  const [pressed, setPressed] = useState(false);
  const [periodDays, setPeriodDays] = useState([]);
  const [nextPeriodStartDate, setNextPeriodStartDate] = useState('');
  const [ongoingPeriod, setOngoingPeriod] = useState(false);
  const [cycleLength, setCycleLength] = useState(28); // Default cycle length
  const [periodLength, setPeriodLength] = useState(5); // Default period length
  const [estimatedMenstrualDays, setEstimatedMenstrualDays] = useState([]);

  const AnimationRef = useRef(null);

  // Conversion of date formats
  const date = new Date();
  const today = date.toISOString().split('T')[0];
  const month = date.toLocaleString('default', { month: 'long' });
  const displayedDate = `${date.getDate()} ${month} ${date.getFullYear()}`;
  const currentDayOfPeriod = 1;

  // Firebase user reference
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const userDocRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setOngoingPeriod(data.ongoingPeriod);
        setPressed(data.ongoingPeriod);
        setNextPeriodStartDate(data.nextPeriodStartDate || '');
        setPeriodDays(data.periodDays || []);
        setCycleLength(data.cycleLength || 28);
        setPeriodLength(data.periodLength || 5);
        setEstimatedMenstrualDays(data.estimatedMenstrualDays || []);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const addDates = async () => {
    if (!userId) return;

    const userDocRef = doc(db, 'users', userId);

    if (!periodDays.includes(today)) {
      const updatedPeriodDays = [...periodDays, today];
      const lastStartDate = today;
      const nextDate = addDays(new Date(lastStartDate), cycleLength);
      const nextPeriodStartDate = nextDate.toISOString().split('T')[0];

      const estimatedDays = Array.from({ length: periodLength }, (_, i) =>
        addDays(new Date(nextPeriodStartDate), i).toISOString().split('T')[0]
      );

      setPressed(true);
      setPeriodDays(updatedPeriodDays);
      setEstimatedMenstrualDays(estimatedDays);
      setNextPeriodStartDate(nextPeriodStartDate);

      await updateDoc(userDocRef, {
        periodDays: updatedPeriodDays,
        lastStartDate,
        estimatedMenstrualDays: estimatedDays,
        nextPeriodStartDate,
        ongoingPeriod: true,
      });
    } else {
      setPressed(false);
      const updatedPeriodDays = periodDays.filter((day) => day !== today);
      setPeriodDays(updatedPeriodDays);

      await updateDoc(userDocRef, {
        periodDays: updatedPeriodDays,
        ongoingPeriod: false,
      });
    }
  };

  const animation = () => {
    if (AnimationRef) {
      AnimationRef.current?.pulse();
    }
  };

  // Calculate countdown to next period
  const diff = moment(nextPeriodStartDate).diff(moment(today));
  let daysLeftBeforePeriodBegins = moment.duration(diff).days();

  if (daysLeftBeforePeriodBegins >= 2) {
    daysLeftBeforePeriodBegins = `${daysLeftBeforePeriodBegins} dagar kvar`;
  } else if (daysLeftBeforePeriodBegins === 1) {
    daysLeftBeforePeriodBegins = `${daysLeftBeforePeriodBegins} dag kvar`;
  } else if (daysLeftBeforePeriodBegins === 0) {
    daysLeftBeforePeriodBegins = 'Mensen är beräknad idag';
  } else {
    daysLeftBeforePeriodBegins = `Mensen är ${Math.abs(
      daysLeftBeforePeriodBegins
    )} dagar sen`;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Överblick"
        icon="cog"
        onPress={() => navigation.navigate('SettingsModal')}
      />
      <Text style={[typography.h5, { marginTop: 50 }]}>{displayedDate}</Text>
      <Animatable.View ref={AnimationRef}>
        <Animatable.Text
          style={[typography.h1, { paddingLeft: 20, paddingRight: 20 }]}
          animation="fadeIn"
          delay={1000}
        >
          {pressed
            ? `Mensdag ${currentDayOfPeriod}`
            : daysLeftBeforePeriodBegins}
        </Animatable.Text>
      </Animatable.View>
      <View style={{ marginBottom: 150 }}>
        <ButtonPrimary
          title={pressed ? 'Mensen är slut' : 'Mensen har börjat'}
          onPress={() => {
            addDates();
            animation();
          }}
        />
      </View>
      <StatusBar barStyle="dark-content" />
    </View>
  );
}
