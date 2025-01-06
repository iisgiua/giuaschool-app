/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Pressable from '../components/PressableComponent';
import Waiting from '../components/WaitingComponent';
import { createDeviceId } from '../utils/DeviceInfo';
import { styles } from './_layout';


// **
// * Pagina per la procedura di associazione del dispositivo all'utente sul registro elettronico
// *
// * @author Antonello Dessì
// *
export default function ConnectScreen() {

  // inizializza
  const [web, setWeb] = useState('');
  const [stage, setStage] = useState(0);
  const [error, setError] = useState('');
  const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 ' + Constants.expoConfig.extra.version;
  const router = useRouter();

  // gestione cambio pagina
  const navigationChanged = (event) => {
    const url = event.url + (event.url.endsWith('/') ? '' : '/');
    if (url == web) {
      // login effettuato con successo
      setStage(2);
    }
  };

  // connessione app
  const connect = async () => {
    // inizializza dati
    const url = web + 'app/device';
    const urlLogout = web + 'logout/';
    let errorFlag = false;
    // crea codice univoco per il dispositivo
    const device = await createDeviceId();
    if (!device) {
      // errore
      setError('Errore nella generazione dell\'ID del dispositivo.\n');
      errorFlag = true;
    } else {
      // associa dispositivo
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'User-Agent': userAgent,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ device: device })
      });
      // controlla risposta
      if (response.ok) {
        // associazione eseguita: memorizza token
        try {
          const data = await response.json();
          SecureStore.setItem('token', data['token']);
        } catch (err) {
          setError('Errore nella memorizzazione del token.\n' + err);
          errorFlag = true;
        }
      } else {
        setError('Errore nell\'associazione del dispositivo.\n');
        errorFlag = true;
      }
    }
    // logout dal registro
    await fetch(urlLogout, {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
      },
    });
    if (errorFlag) {
      // mostra l'errore
      setStage(9);
    } else {
      // passo finale
      setStage(3);
    }
  }

  // eseguito solo al primo render
  useEffect(() => {
    // legge dati dalla memoria
    const result = SecureStore.getItem('userData');
    if (result) {
      const state = JSON.parse(result);
      setWeb(state.web);
    } else {
      // errore
      setError('Errore nel recupero dei dati memorizzati nel dispositivo.\n');
      setStage(9);
    }
  }, []);

  // visualizza pagina
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Associa il dispositivo',
        }}
      />
      {stage == 0 && (
        <View style={styles.pageContainer}>
          <Text style={styles.text}>
            Questo dispositivo sarà associato al tuo utente sul registro elettronico,
            in modo che non sia più necessario usare le tue credenziali per collegarti.
          </Text>
          <Text style={styles.text}>
            Dovrai ora effettuare il normale accesso al registro elettronico:
            subito dopo, l'applicazione prenderà il controllo per eseguire
            la registrazione del tuo dispositivo.
          </Text>
          <Pressable
            style={styles.buttonContainer}
            onPress={() => setStage(1)}>
            <Text style={styles.buttonPrimary}>Associa il dispositivo</Text>
          </Pressable>
        </View>
      )}
      {stage == 1 && (
        <WebView
          source={{ uri: web + 'logout/' }}
          onError={(event) => {
            setError('Errore di connessione\n' + event.nativeEvent.description);
            setStage(9);
          }}
          onHttpError={(event) => {
            setError('Errore di connessione\n' + event.nativeEvent.description);
            setStage(9);
          }}
          onNavigationStateChange={navigationChanged}
          startInLoadingState={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          userAgent={userAgent}
          renderLoading={() => <Waiting />}
        />
      )}
      {stage == 2 && (
        <View
          style={styles.pageContainer}
          onLayout={connect}>
          <Waiting />
        </View>
      )}
      {stage == 3 && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitleSuccess}>DISPOSITIVO ASSOCIATO</Text>
            <Text style={styles.modalMessage}>La procedura di associazione del dispositivo al tuo utente è stata eseguita correttamente.</Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.buttonPrimary}>INDIETRO</Text>
            </Pressable>
          </View>
        </View>
      )}
      {stage == 9 && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitleError}>ERRORE</Text>
            <Text style={styles.modalMessage}>{error}</Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.buttonPrimary}>INDIETRO</Text>
            </Pressable>
          </View>
        </View>
      )}
    </>
  );
};
