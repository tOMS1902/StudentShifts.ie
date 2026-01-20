import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import JobDetailsScreen from './screens/JobDetailsScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import ApplicationsScreen from './screens/ApplicationsScreen';
import ChatScreen from './screens/ChatScreen';
import PublicProfileScreen from './screens/PublicProfileScreen';
import EmployerDashboardScreen from './screens/EmployerDashboardScreen';
import ManageShiftScreen from './screens/ManageShiftScreen';
import EmployerOnboardingScreen from './screens/EmployerOnboardingScreen';
import PostShiftScreen from './screens/PostShiftScreen';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const user = await AsyncStorage.getItem('ss:user');
      setInitialRoute(user ? 'Home' : 'Login');
      // In a real app, we would check user.role to decide if Home or EmployerDashboard
    } catch {
      setInitialRoute('Login');
    }
  };

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#d946ef" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Applications" component={ApplicationsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="PublicProfile" component={PublicProfileScreen} />
        <Stack.Screen name="EmployerDashboard" component={EmployerDashboardScreen} />
        <Stack.Screen name="ManageShift" component={ManageShiftScreen} />
        <Stack.Screen name="EmployerOnboarding" component={EmployerOnboardingScreen} />
        <Stack.Screen name="PostShift" component={PostShiftScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
