/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import * as Linking from 'expo-linking';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Pressable from '../components/PressableComponent';
import { styles } from './_layout';


// **
// * Pagina informativa sui nuovi aggiornamenti
// *
// * @author Antonello Dessì
// *
export default function UpdatesScreen() {

  // inizializza
  const [url, setUrl] = useState('');
  const router = useRouter();

  // eseguito solo al primo render
  useEffect(() => {
    // legge dati dalla memoria
    const result = SecureStore.getItem('userData');
    if (result) {
      const state = JSON.parse(result);
      const urlApp = state.web + 'app/info/'
      setUrl(urlApp);
    }
  }, []);

  // visualizza pagina
  return (
    <View style={styles.pageContainer}>
      <Stack.Screen
        options={{
          title: 'Aggiornamenti',
        }}
      />
      <View style={styles.center}>
        <Text style={styles.modalTitleSuccess}>AGGIORNAMENTO DISPONIBILE</Text>
      </View>
      <Text style={styles.modalMessage}>E' disponibile la nuova versione dell'app in uso.</Text>
      <Text style={styles.modalMessage}>Si può scaricare dall'apposita pagina del registro elettronico.</Text>
      <View style={styles.center}>
        <Pressable
          style={styles.spaced}
          onPress={() => Linking.openURL(url)}>
          <Text style={styles.buttonPrimary}>SCARICA APP</Text>
        </Pressable>
        <Pressable
          style={styles.spaced}
          onPress={() => router.back()}>
          <Text style={styles.buttonSecondary}>INDIETRO</Text>
        </Pressable>
      </View>
    </View>
  );
}
