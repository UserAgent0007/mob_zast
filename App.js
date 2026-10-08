import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SearchScreen from './src/screens/SearchScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import { colors } from './src/theme';

const StackNavigator = createStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.line,
    primary: colors.gold,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <NavigationContainer theme={navigationTheme}>
        <StackNavigator.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '700', fontSize: 18 },
            headerShadowVisible: false,
            cardStyle: { backgroundColor: colors.bg },
          }}
        >
          <StackNavigator.Screen
            name="Search"
            component={SearchScreen}
            options={{ title: 'Браузер фільмів' }}
          />
          <StackNavigator.Screen
            name="Details"
            component={DetailsScreen}
            options={({ route }) => ({
              title: route.params?.title || 'Фільм',
            })}
          />
        </StackNavigator.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
