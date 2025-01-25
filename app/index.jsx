/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Stack, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import logo from '../assets/logo.png';
import Pressable from '../components/PressableComponent';
import { checkUpdates } from '../utils/CheckUpdates';
import { styles } from "./_layout";


// **
// * Pagina iniziale dell'app
// *
// * @author Antonello Dessì
// *
export default function HomeScreen() {

  // inizializza
  const [login, setLogin] = useState(false);
  const [executed, setExecuted] = useState(false);
  const router = useRouter();

  // controlla se prima esecuzione
  const checkVersion = () => {
    // controlla se installata nuova versione
    const result = SecureStore.getItem('version');
    if (!result || result !== Constants.expoConfig.extra.version) {
      // nuova versione
      SecureStore.setItem('version', Constants.expoConfig.extra.version);
      router.push('/about');
    } else if (login && !executed) {
      // esegue login automatico
      setExecuted(true);
      router.push('/login');
    }
  };

  // controlli eseguiti ad ogni visualizzazione
  useFocusEffect(
    useCallback(() => {
      if (!login) {
        // controlla impostazioni
        let result = SecureStore.getItem('userData');
        if (result) {
          const state = JSON.parse(result);
          if (state.web != '' && state.web != null) {
            // controlla associazione dispositivo
            result = SecureStore.getItem('token');
            if (result) {
              // abilita il login
              setLogin(true);
            }
          }
        }
      }
    }, [])
  );

  // eseguito solo al primo render
  useEffect(() => {
    // controlla aggiornamenti
    checkUpdates().then((res) => {
      if (res) {
        // aaggiornamenti presenti
        router.push('/updates');
      }
    });
  });

  // visualizza pagina
  return (
    <ScrollView
      onLayout={checkVersion}
      style={styles.pageContainer}>
      <Stack.Screen
        options={{
          title: 'Pagina iniziale',
        }}
      />
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={logo}
        />
        <Text style={styles.logoLabel}>{Constants.expoConfig.extra.version}</Text>
        {Constants.expoConfig.extra.school != '' &&
          <Text style={styles.schoolLabel}>{Constants.expoConfig.extra.school}</Text>
        }
      </View>
      <View style={styles.spacedContainer}>
        {login ?
          <Pressable
            style={styles.spaced}
            onPress={() => router.push('/login')}>
            <Text style={styles.buttonPrimary}>Accedi al registro</Text>
          </Pressable>
          :
          <View style={styles.spaced}>
            <Text style={styles.buttonDisabled}>Accedi al registro</Text>
          </View>
        }
        <Pressable
          style={styles.spaced}
          onPress={() => router.push('/settings')}>
          <Text style={styles.buttonSecondary}>Impostazioni</Text>
        </Pressable>
        <Pressable
          style={styles.spaced}
          onPress={() => router.push('/connect')}>
          <Text style={styles.buttonSecondary}>Associa il dispositivo</Text>
        </Pressable>
        <Pressable
          style={styles.spaced}
          onPress={() => router.push('/about')}>
          <Text style={styles.buttonSecondary}>Informazioni</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
