/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Checkbox from 'expo-checkbox';
import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Pressable from '../components/PressableComponent';
import { styles } from './_layout';


// **
// * Pagina per la memorizzazione delle impostazioni
// *
// * @author Antonello Dessì
// *
export default function SettingsScreen() {

  // inizializza
  const [web, setWeb] = useState(Constants.expoConfig.extra.url ?? 'https://');
  const [authentication, setAuthentication] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const router = useRouter();

  // controlla e salva le impostazioni
  const submit = () => {
    // esegue controlli sulle impostazioni
    let url = '/modal';
    if (web == '' || web == null) {
      // errore: indirizzo web vuoto
      url = `${url}?type=E&title=ATTENZIONE&msg=${encodeURIComponent('Non hai indicato l\'indirizzo web del registro elettronico.')}`;
    } else if (!web.startsWith('https://')) {
      // errore: indirizzo web non valido
      url = `${url}?type=E&title=ATTENZIONE&msg=${encodeURIComponent('L\'indirizzo web del registro elettronico non è valido.')}`;
    } else {
      // impostazioni corrette
      let webUrl = web;
      if (!webUrl.endsWith('/')) {
        // l'indirizzo deve terminare con '/'
        webUrl = webUrl + '/';
        setWeb(web + '/');
      }
      // memorizza dati
      const state = {
        web: webUrl,
        authentication: authentication,
      };
      SecureStore.setItem('userData', JSON.stringify(state));
      url = `${url}?type=S&title=${encodeURIComponent('DATI SALVATI')}&msg=${encodeURIComponent('La memorizzazione delle impostazioni sul dispositivo è avvenuta senza errori.')}`;
    }
    // mostra messaggio
    router.push(url);
  };

  // eseguito solo al primo render
  useEffect(() => {
    // legge dati dalla memoria
    const result = SecureStore.getItem('userData');
    if (result) {
      const state = JSON.parse(result);
      setWeb(state.web);
      setAuthentication(state.authentication);
    }
    // imposta uso di autenticazione biometrica
    LocalAuthentication.supportedAuthenticationTypesAsync()
      .then((types) => {
        if (types && types.length > 0) {
          setBiometrics(true);
        }
      });
  }, []);

  // visualizza pagina
  return (
    <View style={styles.pageContainer}>
      <Stack.Screen
        options={{
          title: 'Impostazioni',
        }}
      />
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Indirizzo web del registro elettronico:</Text>
        <TextInput
          style={Constants.expoConfig.extra.url != '' ? styles.inputFieldDisabled : styles.inputField}
          readOnly={Constants.expoConfig.extra.url != ''}
          onChangeText={(val) => setWeb(val.replace(/\s/g, '').toLowerCase())}
          value={web}
        />
      </View>
      <View style={styles.inputGroup}>
        <Pressable
          onPress={() => setAuthentication(!authentication)}
          disabled={!biometrics}>
          <View style={styles.checkboxContainer}>
            <Checkbox style={styles.checkbox}
              value={authentication}
              disabled={!biometrics}
            />
            <Text style={styles.inputLabel}>Richiede l'autenticazione biometrica del dispositivo prima dell'accesso al registro elettronico</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.buttonGroup}>
        <Pressable onPress={submit}>
          <Text style={styles.buttonPrimary}>SALVA</Text>
        </Pressable>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.buttonSecondary}>INDIETRO</Text>
        </Pressable>
      </View>
    </View>
  );
}
