import React, { useEffect, useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Image, KeyboardAvoidingView, Pressable, Platform, Keyboard, Alert } from 'react-native';
import { validateEmail, validateFirstName } from '../utils';

import { BrandText } from '../components/BrandText';
import { ThemeColors } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../contexts/AuthContext';
import BrandTextInput from '../components/BrandTextInput';
import BrandButton from '../components/BrandButton';

const Header = () => {
  return (
    <View style={styles.header}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
    </View>
  )
}

const firstNameErrorMessage = 'Please enter your name using alphabetical characters, hyphens, or spaces only.';
const emailErrorMessage = 'Please enter a valid email address.';

const Body = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [keyboardShown, setKeyboardShown] = useState(false);

  const { onboard } = useContext(AuthContext)

  useEffect(() => {
    const showKeyboardSub = Keyboard.addListener('keyboardWillShow', () => setKeyboardShown(true));
    const hideKeyboardSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardShown(false));
    return () => {
      showKeyboardSub.remove();
      hideKeyboardSub.remove();
    }
  }, []);

  const setOnboardingInfo = async () => {
    const onboardingInfo = [
      ['firstName', JSON.stringify(firstName)],
      ['email', JSON.stringify(email)]
    ];
    try {
      await AsyncStorage.multiSet(onboardingInfo);
      onboard({ isOnboardingCompleted: true, firstName });
    } catch (err) {
      Alert.alert(`A error occurred: ${err.message}`);
    }
  }

  const isValidFirstName = validateFirstName(firstName);
  const isValidEmail = validateEmail(email);
  const firstNameError = firstName.length > 0 && !isValidFirstName ? firstNameErrorMessage : '';
  const emailError = email.length > 0 && !isValidEmail ? emailErrorMessage : '';
  const disabled = !isValidFirstName || !isValidEmail;

  return (
    <View style={styles.body}>
      <View style={styles.bodyContent}>
        {!keyboardShown && <BrandText type='subtitle' colorName='primary1' style={styles.bodyText}>Let us get to know you</BrandText>}
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.form}>
            <BrandTextInput 
              label='First Name'
              value={firstName}
              onChangeText={(e) => setFirstName(e.trim())}
              keyboardType='default'
              maxLength={50}
              errorMessage={firstNameError}
            />
            <BrandTextInput
              label='Email'
              value={email}
              onChangeText={(e) => setEmail(e.trim())}
              keyboardType='email-address'
              maxLength={255}
              autoCapitalize='none'
              errorMessage={emailError}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
      <View style={styles.footer}>
        <BrandButton type='primary2' disabled={disabled} onPress={setOnboardingInfo}>Next</BrandButton>
      </View>
    </View>
  )
}

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <Body />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: 65,
    width: 250,
    marginRight: 20
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: ThemeColors.secondary3
  },
  bodyText: {
    textAlign: 'center'
  },
  keyboardAvoidingView: {
    justifyContent: 'flex-end'
  },
  form: {
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: 40,
    paddingHorizontal: 20,
    justifyContent: 'flex-end'
  }
});