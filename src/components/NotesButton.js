import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';
import typography from '../styles/typography';
import { firebaseAuth } from '../config/keys'; // Check if firebaseAuth is still needed
import { getFirestore, doc, getDoc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore'; // Firebase v9+ modular imports
import * as Animatable from 'react-native-animatable';

const db = getFirestore(); // Firestore initialization

function NotesButton({ title, date, id }) {
  const [pressed, setPressed] = useState(false);
  const [notesArray, setNotesArray] = useState([]);

  const AnimationRef = useRef(null);

  const animation = () => {
    if (AnimationRef) {
      AnimationRef.current?.pulse();
    }
  };

  useEffect(() => {
    const unsubscribe = async () => {
      try {
        const docRef = doc(db, firebaseAuth.currentUser.uid, date);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          setNotesArray(['null']);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    unsubscribe();

    return () => {}; // Cleanup function
  }, [date]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, firebaseAuth.currentUser.uid, date),
      (docSnap) => {
        if (docSnap.exists()) {
          setNotesArray(docSnap.data().Note || []);
        }
      }
    );

    return () => unsubscribe();
  }, [date]);

  const onPressNote = async () => {
    const newNotesArray = [...notesArray];
    if (pressed || newNotesArray.includes(title)) {
      setPressed(false);
      const index = newNotesArray.indexOf(title);
      if (index > -1) {
        newNotesArray.splice(index, 1);
      }
      await updateDoc(doc(db, firebaseAuth.currentUser.uid, date), {
        Note: newNotesArray,
      });
    } else {
      setPressed(true);
      if (!newNotesArray.includes(title)) {
        newNotesArray.push(title);
      }
      await setDoc(doc(db, firebaseAuth.currentUser.uid, date), {
        Note: newNotesArray,
      });
    }
  };

  const buttonStyle =
    pressed || notesArray.includes(title) ? styles.pressedButton : styles.button;

  return (
    <Animatable.View ref={AnimationRef}>
      <TouchableOpacity
        style={buttonStyle}
        key={id}
        onPress={() => {
          animation();
          onPressNote();
        }}
      >
        <Text style={pressed || notesArray.includes(title) ? typography.buttonPrimary : typography.buttonSecondary}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
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
    shadowColor: '#E92206',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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

export default NotesButton;
