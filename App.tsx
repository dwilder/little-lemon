import React, { useEffect, useReducer, useMemo, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './screens/Onboarding';
import ProfileScreen from './screens/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import SplashScreen from './screens/Splash';

import AuthContext from './contexts/AuthContext';
import LogoTitle from './components/LogoTitle';
import Avatar from './components/Avatar';
import HomeScreen from './screens/Home';
import { ThemeColors } from './constants/Colors';

const Stack = createNativeStackNavigator();

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_ONBOARDING_STATE':
          return {
            ...prevState,
            isLoading: false,
            isOnboardingCompleted: action.isOnboardingCompleted,
            avatarInitials: (action.firstName?.[0] || '') + (action.lastName?.[0] || ''),
            avatarUri: action.avatarUri || ''
          }
        case 'SET_ONBOARDING_COMPLETED':
          return {
            ...prevState,
            isOnboardingCompleted: action.isOnboardingCompleted,
            avatarInitials: action.avatarInitials
          }
        case 'UPDATE_AVATAR':
          return {
            ...prevState,
            avatarInitials: (action.firstName?.[0] || '') + (action.lastName?.[0] || ''),
            avatarUri: action.avatarUri || ''
          }
        case 'LOGOUT':
          return {
            isLoading: false,
            isOnboardingCompleted: false,
            avatarInitials: '',
            avatarUri: ''
          }
      }
    },
    {
      isLoading: true,
      isOnboardingCompleted: false,
      avatarInitials: '',
      avatarUri: ''
    }
  );

  const clearOnboardingInfo = async () => {
    try {
      await AsyncStorage.multiRemove(['firstName', 'email', 'lastName', 'avatarUri']);
    } catch(err) {
      Alert.alert(`Failed to clear storage: ${err.message}`);
    }
  };

  const getOnboardingState = async () => {
    let refreshedData = {'firstName': '', 'lastName': '', 'email': '', 'avatarUri': ''};
    try {
      const data = await AsyncStorage.multiGet(Object.keys(refreshedData));
      refreshedData = data.reduce((acc, pref) => {
        acc[pref[0]] = pref[1] ? JSON.parse(pref[1]) : '';
        return acc;
      }, {});
    } catch(err) {
      Alert.alert(`An error occurred: ${err.message}`);
    } finally {
      const { email, firstName, lastName, avatarUri } = refreshedData;
      const isOnboardingCompleted = !!firstName && !!email;
      dispatch({ type: 'RESTORE_ONBOARDING_STATE', isOnboardingCompleted, firstName, lastName, avatarUri });
    }
  };

  useEffect(() => {
    // clearOnboardingInfo();
    getOnboardingState();
  }, []);

  const authContext = useMemo(
    () => ({
      onboard: async ({ isOnboardingCompleted, firstName }: { isOnboardingCompleted: boolean, firstName: string | null }) => {
        dispatch({
          type: 'SET_ONBOARDING_COMPLETED',
          isOnboardingCompleted,
          avatarInitials: firstName?.[0] || ''
        });
      },
      updateAvatar: async ({ firstName, lastName, avatarUri }: { firstName: string, lastName: string, avatarUri: string }) => {
        dispatch({
          type: 'UPDATE_AVATAR',
          firstName,
          lastName,
          avatarUri
        });
      },
      logout: async () => {
        dispatch({
          type: 'LOGOUT'
        });
      },
      ...state
    }),
    [state]
  );

  if (state.isLoading) {
    return <SplashScreen />
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerTitle: () => <LogoTitle />
        }}>
          {state.isOnboardingCompleted ? (
            <Stack.Group screenOptions={({ navigation, route }) => ({
              headerRight: () => <Avatar size='small' route={route} navigation={navigation} />
            })}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Group>
          ) : (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown: false}} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  )
}

