import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import colors from '../styles/colors';
import typography from '../styles/typography';
import NotesButton from '../components/NotesButton';
import CalendarStrip from 'react-native-calendar-strip';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Using async storage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    justifyContent: 'space-around',
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
  button: {
    borderColor: colors.primary,
    borderWidth: 2,
    height: 42,
    justifyContent: 'center',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 42 / 2,
    marginRight: 8,
    marginTop: 18,
    color: colors.primary,
    fontSize: 16,
  },
  pressedButton: {
    borderColor: colors.primary,
    borderWidth: 2,
    height: 42,
    justifyContent: 'center',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 42 / 2,
    marginRight: 8,
    marginTop: 18,
    backgroundColor: colors.primary,
    fontSize: 16,
  },
});

// Conversion of dates
let date = new Date();
const month = date.toLocaleString('default', { month: 'long' });
let displayedDate = date.getDate() + ' ' + month;

let symptomNotes = [
  'Ledsen',
  'PMS',
  'Mensvärk',
  'Glad',
  'Irriterad',
  'Rastlös',
];
let periodNotes = ['Lätt', 'Måttlig', 'Riklig'];
let sexNotes = ['Skyddat sex', 'Oskyddat sex'];

export default function Notes({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(displayedDate);

  useEffect(() => {
    // Example: Fetching stored date from AsyncStorage (if needed)
    const getStoredDate = async () => {
      try {
        const storedDate = await AsyncStorage.getItem('selectedDate');
        if (storedDate !== null) {
          setSelectedDate(storedDate);
        }
      } catch (error) {
        console.error('Failed to load selected date from storage', error);
      }
    };

    getStoredDate();
  }, []);

  // Save selected date to AsyncStorage (if needed)
  const handleDateChange = async (newDate) => {
    try {
      await AsyncStorage.setItem('selectedDate', newDate);
      setSelectedDate(newDate);
    } catch (error) {
      console.error('Failed to save selected date', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Anteckningar"
        icon="cross"
        onPress={() => navigation.goBack()}
      />
      <View style={{ paddingLeft: 20, marginTop: 60 }}>
        <Text style={typography.h1}>{selectedDate}</Text>
      </View>
      <View style={{ paddingLeft: 20 }}>
        <Text style={typography.h5}>Symtom</Text>
        <View style={{ flexDirection: 'row', marginBottom: 40, height: 70 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {symptomNotes.map((symptom) => (
              <NotesButton
                title={symptom}
                date={selectedDate}
                key={symptom}
                onPress={() => handleDateChange(symptom)} // Handle date change on button press
              />
            ))}
          </ScrollView>
        </View>
        <Text style={typography.h5}>Mens</Text>
        <View style={{ flexDirection: 'row', marginBottom: 40 }}>
          {periodNotes.map((period) => (
            <NotesButton
              title={period}
              date={selectedDate}
              key={period}
              onPress={() => handleDateChange(period)} // Handle date change on button press
            />
          ))}
        </View>
        <Text style={typography.h5}>Sex</Text>
        <View style={{ flexDirection: 'row', marginBottom: 40 }}>
          {sexNotes.map((sex) => (
            <NotesButton
              title={sex}
              date={selectedDate}
              key={sex}
              onPress={() => handleDateChange(sex)} // Handle date change on button press
            />
          ))}
        </View>
      </View>
    </View>
  );
}
