import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import BrandTextInput from '../components/BrandTextInput';
import BrandButton from '../components/BrandButton';
import { BrandText } from '../components/BrandText';
import Avatar from '../components/Avatar';
import BrandCheckbox from '../components/BrandCheckbox';
import AuthContext from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { updateAvatar, logout } = useContext(AuthContext)
  const [userData, setUserData] = useState({
    avatarUri: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    notificationOrderStatuses: false,
    notificationPasswordChanges: false,
    notificationSpecialOffers: false,
    notificationNewsletter: false
  });

  const getAvatarInitialsOverride = (firstName: string, lastName: string) => {
    const firstInitial = typeof firstName === 'string' && firstName[0] || '';
    const secondInitial = typeof lastName === 'string' && lastName[0] || '';
    return firstInitial + secondInitial;
  };

  const avatarInitialsOverride = getAvatarInitialsOverride(userData.firstName, userData.lastName);

  const loadProfileData = async () => {
    const keys = Object.keys(userData);
    try {
      const data = await AsyncStorage.multiGet(keys);
      const dataObj = data.reduce((acc, pref) => {
        acc[pref[0]] = JSON.parse(pref[1]);
        return acc;
      }, {});
      setUserData(dataObj);
    } catch (err) {
      Alert.alert(`An error occurred: ${err.message}`);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 4],
      quality: 1
    });
    
    if (!result.canceled) {
      setUserData({ ...userData, avatarUri: result.assets[0]?.uri})
    }
  };

  const removeImage = () => {
    setUserData({ ...userData, avatarUri: '' });
  };

  const clearProfileData = async () => {
    try {
      await AsyncStorage.multiRemove(Object.keys(userData));
      logout();
    } catch (err) {
      Alert.alert(`An error occurred: ${err.message}`);
    }
  }

  const updateProfileData = async () => {
    const { firstName, lastName, avatarUri } = userData;
    const keyValuePairs =
      Object.entries(userData).map((entry) => ([entry[0], JSON.stringify(entry[1])]));
    try {
      await AsyncStorage.multiSet(keyValuePairs);
      updateAvatar({ firstName, lastName, avatarUri });
    } catch (err) {
      Alert.alert(`An error occurred: ${err.message}`);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps='never'>
        <BrandText type='sectionCategory' style={styles.sectionHeader}>Personal Information</BrandText>

        <View>
          <BrandText type='highlightText'>Avatar</BrandText>
          <View style={styles.avatarField}>
            <Avatar avatarOverrideUri={userData.avatarUri} forceNullAvatar={!userData.avatarUri} avatarInitialsOverride={avatarInitialsOverride} />
            <BrandButton type='primary1' style={styles.avatarButtons} onPress={pickImage}>{userData.avatarUri ? 'Change' : 'Upload'}</BrandButton>
            {userData.avatarUri ? (
              <BrandButton type='ghost' style={styles.avatarButtons} onPress={removeImage}>Remove</BrandButton>
            ) : null}
          </View>
        </View>

        <BrandTextInput
          label='First Name'
          value={userData.firstName}
          onChangeText={(e) => setUserData({ ...userData, firstName: e })}
          maxLength={50}
        />

        <BrandTextInput
          label='Last Name'
          value={userData.lastName}
          onChangeText={(e) => setUserData({ ...userData, lastName: e })}
          maxLength={50}
        />

        <BrandTextInput
          label='Email'
          value={userData.email}
          onChangeText={(e) => setUserData({ ...userData, email: e })}
          keyboardType='email-address'
          maxLength={255}
          autoCapitalize='none'
        />

        <BrandTextInput
          label='Phone Number'
          mask={'(999) 999-9999'}
          value={userData.phoneNumber}
          onChangeText={(e) => setUserData({ ...userData, phoneNumber: e })}
          keyboardType='phone-pad'
        />

        <BrandText type='sectionCategory' style={styles.sectionHeader}>Email Notifications</BrandText>

        <BrandCheckbox
          value={userData.notificationOrderStatuses}
          onValueChange={(newVal) => {
            setUserData({ ...userData, notificationOrderStatuses: newVal })
          }}
          label='Order statuses'
        />

        <BrandCheckbox
          value={userData.notificationPasswordChanges}
          onValueChange={(newVal) => {
            setUserData({ ...userData, notificationPasswordChanges: newVal })
          }}
          label='Password changes'
        />

        <BrandCheckbox
          value={userData.notificationSpecialOffers}
          onValueChange={(newVal) => {
            setUserData({ ...userData, notificationSpecialOffers: newVal })
          }}
          label='Special offers'
        />

        <BrandCheckbox
          value={userData.notificationNewsletter}
          onValueChange={(newVal) => {
            setUserData({ ...userData, notificationNewsletter: newVal })
          }}
          label='Newsletter'
        />

        <BrandButton type='primary2' onPress={clearProfileData} style={styles.logoutButton}>Log out</BrandButton>

        <View style={styles.footer}>
          <BrandButton type='ghost' onPress={loadProfileData} style={styles.footerButton}>Discard changes</BrandButton>
          <BrandButton type='primary1' onPress={updateProfileData} style={styles.footerButton}>Save changes</BrandButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100
  },
  sectionHeader: {
    marginBottom: 20
  },
  avatarField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30
  },
  avatarButtons: {
    marginLeft: 20
  },
  checkboxField: {
    flexDirection: 'row'
  },
  checkboxLabel: {
    marginLeft: 20
  },
  footer: {
    flexDirection: 'row',
    marginTop: 40
  },
  logoutButton: {
    marginTop: 20
  },
  footerButton: {
    marginHorizontal: 10
  }
});