/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Stack, useRouter } from "expo-router";
// import * as SecureStore from 'expo-secure-store';
// import { useCallback, useState } from "react";
// import { useState } from "react";
import { Text, View } from "react-native";
// import { Image, ScrollView, Text, View } from "react-native";
// import logo from '../assets/logo.png';
import Pressable from '../components/PressableComponent';
import { styles } from "./_layout";


// **
// * Pagina iniziale dell'app
// *
// * @author Antonello Dessì
// *
export default function HomeScreen() {

  // inizializza
  // const [login, setLogin] = useState(true);
  const router = useRouter();

  // // controlla versione
  // const checkVersion = () => {
  //   // controlla aggiornamento
  //   const result = SecureStore.getItem('version');
  //   if (!result || result !== Constants.expoConfig.extra.version) {
  //     // nuova versione
  //     SecureStore.setItem('version', Constants.expoConfig.extra.version);
  //     router.push('/about');
  //   } else if (login) {
  //     // esegue login automatico
  //     router.push('/login');
  //   }
  // };

  // controlli eseguiti ad ogni visualizzazione
  // useFocusEffect(
  //   useCallback(() => {
  //     if (!login) {
  //       // controlla impostazioni
  //       result = SecureStore.getItem('userData');
  //       if (result) {
  //         const state = JSON.parse(result);
  //         if (state.web != '' && state.web != null) {
  //           // controlla associazione dispositivo
  //           result = SecureStore.getItem('token');
  //           if (result) {
  //             // abilita il login
  //             setLogin(true);
  //           }
  //         }
  //       }
  //     }
  //   }, [])
  // );

  // visualizza pagina
  return (
    // <ScrollView style={styles.pageContainer}>
    <View style={styles.pageContainer}>
      <Stack.Screen
        options={{
          title: 'Pagina iniziale',
        }}
      />
      <View style={styles.logo_Container}>
        {/* <Image
          // style={styles.logo}
          // source={logo}
         />*/}
        <Text style={styles.logo_Label}>{Constants.expoConfig.extra.version}</Text>
        {Constants.expoConfig.extra.school != '' &&
          <Text style={styles.school_Label}>{Constants.expoConfig.extra.school}</Text>
        }
      </View>
      <View style={styles.spacedContainer}>
        {/* {login ? */}
          <Pressable
            style={styles.spaced}
            onPress={() => router.push('/login')}>
            <Text style={styles.buttonPrimary}>Accedi al registro</Text>
          </Pressable>
          {/* : */}
          {/* <View style={styles.spaced}> */}
            {/* <Text style={styles.buttonDisabled}>Accedi al registro</Text> */}
          {/* </View> */}
        {/* } */}
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
    {/* </ScrollView> */}
    </View>
  );
}
