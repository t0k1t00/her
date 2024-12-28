import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../styles/colors';
import typography from '../styles/typography';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore();

LocaleConfig.locales['sv'] = {
  monthNames: [
    'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec',
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec',
  ],
  dayNames: ['M', 'T', 'O', 'T', 'F', 'L', 'S'],
  dayNamesShort: ['M', 'T', 'O', 'T', 'F', 'L', 'S'],
  today: 'Idag',
};

LocaleConfig.defaultLocale = 'sv';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 28,
    width: 343,
    height: 410,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 50,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: 200,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default function PeriodCalendar() {
  const [period, setPeriod] = useState([]);
  const [estimatedMenstrualDays, setEstimatedMenstrualDays] = useState([]);

  const loadLocalData = async () => {
    try {
      const storedPeriod = await AsyncStorage.getItem('periodDays');
      const storedEstimated = await AsyncStorage.getItem('estimatedMenstrualDays');
      if (storedPeriod) setPeriod(JSON.parse(storedPeriod));
      if (storedEstimated) setEstimatedMenstrualDays(JSON.parse(storedEstimated));
    } catch (error) {
      console.error('Error loading local data:', error);
    }
  };

  const saveLocalData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving local data:', error);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    loadLocalData();

    const unsubscribe = db.collection('users')
      .doc(getAuth().currentUser?.uid)
      .onSnapshot((doc) => {
        if (doc.exists && isSubscribed) {
          const data = doc.data();
          const fetchedPeriod = data.periodDays || [];
          const fetchedEstimated = data.estimatedMenstrualDays || [];
          
          setPeriod(fetchedPeriod);
          setEstimatedMenstrualDays(fetchedEstimated);

          saveLocalData('periodDays', fetchedPeriod);
          saveLocalData('estimatedMenstrualDays', fetchedEstimated);
        }
      });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  const markedPeriod = period.reduce((acc, date) => ({
    ...acc,
    [date]: {
      color: colors.primary,
      textColor: colors.white,
      endingDay: true,
      startingDay: true,
    },
  }), {});

  const markedEstimatedMenstrualDays = estimatedMenstrualDays.reduce((acc, date) => ({
    ...acc,
    [date]: {
      color: colors.secondary,
      textColor: colors.white,
      endingDay: true,
      startingDay: true,
    },
  }), {});

  const allMarked = { ...markedPeriod, ...markedEstimatedMenstrualDays };

  return (
    <View style={styles.container}>
      <Calendar
        horizontal={true}
        pagingEnabled={true}
        enableSwipeMonths={true}
        markingType={'period'}
        markedDates={allMarked}
        style={{
          borderRadius: 28,
          height: 410,
          width: 343,
        }}
        theme={{
          backgroundColor: colors.secondary,
          calendarBackground: colors.white,
          textSectionTitleColor: colors.primary,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.white,
          todayTextColor: colors.white,
          todayBackgroundColor: colors.orange,
          dayTextColor: colors.primary,
          textDisabledColor: colors.secondary,
          dotColor: colors.primary,
          arrowColor: colors.primary,
          monthTextColor: colors.primary,
          textDayFontFamily: 'KarlaRegular',
          textMonthFontFamily: 'KarlaBold',
          textDayHeaderFontFamily: 'KarlaRegular',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 16,
          'stylesheet.calendar.header': {
            week: {
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
            monthText: {
              backgroundColor: colors.primary,
              color: colors.white,
              fontFamily: 'BrandonBold',
              fontSize: 18,
              margin: 10,
              width: 106,
              padding: 8,
              textAlign: 'center',
              borderRadius: 20,
              overflow: 'hidden',
              borderColor: colors.primary,
            },
          },
        }}
      />
      <View style={styles.wrapper}>
        <View style={styles.row}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: colors.primary,
              marginRight: 10,
            }}
          ></View>
          <Text style={typography.h4}>Mens</Text>
        </View>
        <View style={styles.row}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: colors.secondary,
              marginRight: 10,
            }}
          ></View>
          <Text style={typography.h4}>Förväntad mens</Text>
        </View>
      </View>
    </View>
  );
}
