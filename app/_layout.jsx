/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import { NavigationBar } from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';


// **
// * Impostazioni del layout di tutte le pagine
// *
// * @author Antonello Dessì
// *
export default function Layout() {

  return (
    <SafeAreaProvider>

      <StatusBar style="light" />

      <NavigationBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#5c6f82',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          animation: 'default',
          contentStyle: {
            backgroundColor: '#eeeeff',
          },
          statusBarStyle: 'light',
          title: '',
        }}
      />

    </SafeAreaProvider>
  );

}
