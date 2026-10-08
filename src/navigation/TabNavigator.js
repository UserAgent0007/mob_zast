            import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ConverterScreen from '../screens/ConverterScreen';
import HistoryScreen from '../screens/HistoryScreen';
import RatesScreen from '../screens/RatesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Converter: ['swap-horizontal', 'swap-horizontal-outline'],
  Rates: ['stats-chart', 'stats-chart-outline'],
  History: ['time', 'time-outline'],
  Settings: ['settings', 'settings-outline'],
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.mint,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = ICONS[route.name];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Converter" component={ConverterScreen} options={{ title: 'Конвертер' }} />
      <Tab.Screen name="Rates" component={RatesScreen} options={{ title: 'Курси' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Історія' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ще' }} />
    </Tab.Navigator>
  );
}
