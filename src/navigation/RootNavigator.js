import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CurrencyPickerScreen from '../screens/CurrencyPickerScreen';
import RateDetailsScreen from '../screens/RateDetailsScreen';
import { colors } from '../theme';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.line,
    primary: colors.mint,
  },
};

export default function () {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          headerShadowVisible: false,
          cardStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="CurrencyPicker"
          component={CurrencyPickerScreen}
          options={{ title: 'Обрати валюту' }}
        />
        <Stack.Screen
          name="RateDetails"
          component={RateDetailsScreen}
          options={{ title: 'Деталі курсу' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
