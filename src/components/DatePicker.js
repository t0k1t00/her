import React, { useState } from 'react';
import { View, Platform, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../styles/colors';

const DatePicker = () => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = async (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // For iOS, keep picker open; for others, close it
    setDate(currentDate);
    await AsyncStorage.setItem('lastStartDate', currentDate.toISOString());
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', margin: 20 }}>
      <Button onPress={showDatepicker} title="Select Date" color={colors.primary} />
      {show && (
        <DateTimePicker
          mode={mode}
          value={date}
          style={{ width: 300, height: 125 }}
          onChange={onChange}
          is24Hour={true}
        />
      )}
    </View>
  );
};

export default DatePicker;
