/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Pressable from '../components/PressableComponent';
import Waiting from '../components/WaitingComponent';
import { createDeviceId } from '../utils/DeviceInfo';
import { styles } from './_layout';


// **
// * Pagina per la procedura di login sul registro elettronico
// *
// * @author Antonello Dessì
// *
export default function LoginScreen() {

  // inizializza
  const [web, setWeb] = useState('');
  const [authentication, setAuthentication] = useState(false);
  const [token, setToken] = useState('');
  const [stage, setStage] = useState(0);
  const [error, setError] = useState('');
  const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 ' + Constants.expoConfig.extra.version;
  const router = useRouter();

  // controlla i dati memorizzati ed esegue l'autenticazione sul dispositivo
  const check = () => {
    // controlla dati
    if (web == '' || web == null) {
      // errore: nessun indirizzo web
      setError('Non hai impostato l\'indirizzo web del registro elettronico.');
      setStage(9);
    } else if (token == '' || token == null) {
      // errore: nessun token
      setError('Non hai effettuato la procedura per associare il dispositivo al tuo utente sul registro elettronico.');
      setStage(9);
    } else {
      // dati ok
      if (authentication) {
        // autenticazione biometrica
        const options = {
          promptMessage: 'Usa l\'autenticazione biometrica del dispositivo',
          fallbackLabel: 'Inserisci il PIN se necessario',
          cancelLabel: 'Annulla',
        };
        LocalAuthentication.authenticateAsync(options)
          .then((res) => {
            if (res.success) {
              setStage(1);
            }
          })
          .catch((err) => {
            // errore nella procedura di autenticazione
            setError('Impossibile eseguire l\'autenticazione sul dispositivo\n' + err);
            setStage(9);
          });
      } else {
        setStage(1);
      }
    }
  };

  // login e apertura registro
  const login = async () => {
    // inizializza
    const urlLogin = web + 'login/token/';
    // login app
    try {
      // crea codice univoco per il dispositivo
      const device = await createDeviceId();
      if (!device) {
        // errore
        throw new Error('Errore nella generazione dell\'ID del dispositivo');
      }
      const response = await fetch(urlLogin, {
        method: 'POST',
        headers: {
          'User-Agent': userAgent,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token, device: device })
      });
      const data = await response.json();
      if (data.success) {
        const url = web + 'login/connect/' + data.otp;
        // apre browser predefinito sul registro
        router.push(url);
        // riporta alla pagina iniziale l'app
        router.back();
      } else {
        // errore durante il login
        setError('Impossibile eseguire l\'accesso al registro elettronico.\n' + data.error);
        setStage(9);
      }
    } catch (err) {
      // errore nella procedura di login
      setError('Impossibile eseguire l\'accesso al registro elettronico.\n' + err);
      setStage(9);
    }
  };

  // eseguito solo al primo render
  useEffect(() => {
    // legge dati dalla memoria
    let result = SecureStore.getItem('userData');
    if (result) {
      const state = JSON.parse(result);
      setWeb(state.web);
      setAuthentication(state.authentication);
      result = SecureStore.getItem('token');
      if (result) {
        setToken(result);
      } else {
        // errore
        setError('Errore nel recupero dei dati memorizzati nel dispositivo.\n');
        setStage(9);
      }
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
          title: 'Accedi al registro',
        }}
      />
      {stage == 0 && (
        <View
          style={styles.pageContainer}
          onLayout={check}>
          <Text style={styles.text}>Esegui l'autenticazione sul tuo dispositivo.</Text>
        </View>)}
      {stage == 1 && (
        <View
          style={styles.pageContainer}
          onLayout={login}>
          <Text style={styles.text}>Accesso al registro in corso.</Text>
          <Waiting />
        </View>)}
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
}
