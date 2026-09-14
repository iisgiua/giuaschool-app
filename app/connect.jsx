/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import { AppState, Linking, Platform, Text, View } from 'react-native';
import Pressable from '../components/PressableComponent';
import Waiting from '../components/WaitingComponent';
import { styles } from './_layout';
import RNBiometrics from 'react-native-easy-biometrics';


// definizione costanti
const DEVICE_KEY_ALIAS = 'it.iisgiua.giuaschoolapp.device_identity_key';


// **
// * Pagina per la procedura di connessione al registro elettronico.
// *
// * @author Antonello Dessì
export default function ConnectScreen() {
  // variabili
  const [web, setWeb] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [stage, setStage] = useState(0);
  const [loginExecuted, setLoginExecuted] = useState(false);
  const [error, setError] = useState('');
  const userAgent = `GiuaSchoolApp/${Constants.expoConfig.extra.version} (${Platform.OS})`;
  const router = useRouter();
  const appState = useRef(AppState.currentState);
  const browserOpened = useRef(false);

  // connessione al registro
  const connect = async () => {
    try {
      const urlRequest = web + 'api/auth/request';
      const response = await fetch(urlRequest, {
        method: 'POST',
        headers: {
          'User-Agent': userAgent,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dispositivoId: deviceId }),
      });

      if (!response.ok) {
        throw new Error(`Richiesta fallita (${response.status}).`);
      }
      const data = await response.json();
      const { id, casuale: nonce } = data;

      if (!id || !nonce) {
        throw new Error('Risposta non valida dal server.');
      }

      const payload = `GS-AUTH-v1\n${id}\n${nonce}`;

      const result = await RNBiometrics.createSignature({
        payload,
        promptMessage: 'Autorizza l\'accesso al registro elettronico',
        keyAlias: DEVICE_KEY_ALIAS,
      });

      // Distingue esplicitamente un annullamento/fallimento biometrico
      // da un errore di rete, invece di procedere con una firma assente
      if (!result.success || !result.signature) {
        throw new Error(result.error || 'Autenticazione biometrica annullata o non riuscita.');
      }

      const urlValidate = web + 'api/auth/validate';
      const responseValidate = await fetch(urlValidate, {
        method: 'POST',
        headers: {
          'User-Agent': userAgent,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, firma: result.signature }),
      });

      if (!responseValidate.ok) {
        throw new Error(`Validazione fallita (${responseValidate.status}).`);
      }
      const dataValidate = await responseValidate.json();
      const { code } = dataValidate;

      if (!code) {
        throw new Error('Il server non ha restituito un codice di accesso valido.');
      }

      const urlConnect = web + 'api/auth/connect?code=' + encodeURIComponent(code);

      try {
        browserOpened.current = true;
        await Linking.openURL(urlConnect);
      } catch {
        throw new Error('Impossibile aprire il browser per completare l\'accesso.');
      }
    } catch (err) {
      // Unico punto di gestione errori per l'intero flusso di login:
      // qualunque fallimento (rete, biometria, validazione, apertura
      // browser) porta correttamente alla schermata di errore esistente
      setError(err instanceof Error ? err.message : String(err));
      setStage(9);
    }
  };

  // Effetto dedicato: innesca connect() quando si entra nello stage 1,
  useEffect(() => {
    if (stage !== 1 || loginExecuted) {
      return;
    }
    setLoginExecuted(true);
    connect();

  }, [stage, loginExecuted]);

  useEffect(() => {
    const initialize = async () => {
      try {
        let result = await SecureStore.getItem('userData');
        if (!result) {
          throw new Error('Errore nel recupero dei dati memorizzati nel dispositivo.');
        }
        const state = JSON.parse(result);
        if (state.web == '' || state.web == null) {
          throw new Error('Non hai impostato l\'indirizzo web del registro elettronico.');
        }
        // Normalizza una sola volta la barra finale, per evitare URL malformate
        setWeb(state.web.endsWith('/') ? state.web : state.web + '/');

        result = await SecureStore.getItem('dispositivoId');
        if (!result) {
          throw new Error('Non hai effettuato la procedura per associare il dispositivo al tuo utente sul registro elettronico.');
        }
        setDeviceId(result);

        setStage(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setStage(9);
      }
    }
    initialize();
  }, []);

  useEffect(() => {
    const stateListener = AppState.addEventListener('change', (next) => {
      if (next === 'active' && appState.current.match(/inactive|background/) && browserOpened.current) {
        router.back();
      }
      appState.current = next;
    });
    return () => stateListener.remove();
  }, []);

  // visualizzazione pagina
  return (
    <>
      <Stack.Screen options={{ title: 'Accedi al registro' }} />
      {stage == 0 && (
        <View style={styles.pageContainer}>
          <Text style={styles.text}>Esegui l'autenticazione sul tuo dispositivo.</Text>
        </View>
      )}
      {stage == 1 && (
        <View style={styles.pageContainer}>
          <Text style={styles.text}>Accesso al registro in corso.</Text>
          <Waiting />
        </View>
      )}
      {stage == 9 && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitleError}>ERRORE</Text>
            <Text style={styles.modalMessage}>{String(error)}</Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.buttonPrimary}>INDIETRO</Text>
            </Pressable>
          </View>
        </View>
      )}
    </>
  );

}
