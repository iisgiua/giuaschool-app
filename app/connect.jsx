/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import { Stack, useRouter } from 'expo-router';
import { AppState, Linking, Text, View } from 'react-native';
import RNBiometrics from 'react-native-easy-biometrics';
import { useEffect, useRef, useState } from 'react';
import Pressable from '../components/PressableComponent';
import Waiting from '../components/WaitingComponent';
import { styles } from '../styles/AppStyles';
import { APP_CONSTANTS } from '../utils/AppConstants';
import { closePage } from '../utils/Navigation';
import { getWebSite, clearDeviceId, getDeviceId } from '../utils/Storage';


// **
// * Pagina per la procedura di connessione al registro elettronico.
// *
// * @author Antonello Dessì
// *
export default function ConnectScreen() {

  // inizializza
  const [web, setWeb] = useState('');
  const [device, setDevice] = useState('');
  const [stage, setStage] = useState(0);
  const [error, setError] = useState('');
  const router = useRouter();
  const appState = useRef(AppState.currentState);
  const browserOpened = useRef(false);

  // connessione al registro
  const connect = async (url, devId) => {
    let errorMessage = '';
    const requestUrl = url + APP_CONSTANTS.REQUEST_URL;
    const validateUrl = url + APP_CONSTANTS.VALIDATE_URL;
    try {
      // richiesta di autenticazione
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'User-Agent': APP_CONSTANTS.BACKEND_UA,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dispositivoId: devId }),
      });
      const dataResponse = await response.json();
      if (!response.ok) {
        // errore sulla richiesta
        if (dataResponse.errore == 'DISPOSITIVO_NON_VALIDO') {
          // distingue il caso di registrazione scaduta
          errorMessage = 'La registrazione del dispositivo è scaduta: devi registrarlo nuovamente.';
          // forza la nuova registrazione
          await clearDeviceId();
        }
        throw new Error(`[${response.status}]`);
      }
      // legge dati di risposta
      const id = dataResponse.id;
      const nonce = dataResponse.casuale;
      if (!id || !nonce) {
        // errore sul server
        throw new Error('Risposta non valida dal server. [201]');
      }
      // firma certificato con sblocco biometrico
      const payload = `${APP_CONSTANTS.AUTH_PROTOCOL}\n${id}\n${nonce}`;
      const signature = await RNBiometrics.createSignature({
        payload,
        promptMessage: 'Autorizza l\'accesso al registro elettronico',
        keyAlias: APP_CONSTANTS.DEVICE_KEY});
      if (!signature.success || !signature.signature) {
        // errore: fallimento della procedura biometrica
        throw new Error('Autenticazione biometrica annullata o non riuscita.');
      }
      // validazione della richiesta di autenticazione
      const responseValidate = await fetch(validateUrl, {
        method: 'POST',
        headers: {
          'User-Agent': APP_CONSTANTS.BACKEND_UA,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, firma: signature.signature }),
      });
      if (!responseValidate.ok) {
        // errore di validazione
        throw new Error(`[${responseValidate.status}]`);
      }
      // legge dati di risposta
      const dataValidate = await responseValidate.json();
      const code = dataValidate.codice;
      if (!code) {
        // errore sul server
        throw new Error('Risposta non valida dal server. [202]');
      }
      // apertura registro su browser esterno
      const connectUrl = url + APP_CONSTANTS.CONNECT_URL + encodeURIComponent(code);
      try {
        browserOpened.current = true;
        await Linking.openURL(connectUrl);
      } catch {
        browserOpened.current = false;
        throw new Error('Impossibile aprire il browser per completare l\'accesso. [203]');
      }
    } catch (err) {
      // errore
      setError(errorMessage ? errorMessage :
        "Errore nell'apertura del registro elettronico.\n\n" + (err instanceof Error ? err.message : String(err)));
      setStage(9);
    }
  };

  // inizializzazione
  const initialize = async () => {
    let url = '';
    let devId = '';
    try {
      // legge URL del registro elettronico
      url = getWebSite();
      if (!url) {
        // errore: URL del registro elettronico non presente
        throw new Error('Non hai impostato l\'indirizzo web del registro elettronico.\n');
      }
      // memorizza l'URL del registro elettronico
      setWeb(url);
      // legge identificativo del dispositivo
      devId = getDeviceId();
      if (!devId) {
        // errore: identificativo del dispositivo non presente
        throw new Error('Non hai eseguito la registrazione del dispositivo.');
      }
      // memorizza l'identificativo del dispositivo
      setDevice(devId);
      // restituisce immediatamente i valori al chiamante
      return {url: url, devId: devId};
    } catch (err) {
      setError("Errore nell'apertura del registro elettronico.\n\n" +
        (err instanceof Error ? err.message : String(err)));
      setStage(9);
      return null; // segnale esplicito di fallimento della procedura
    }
  };

  // eseguito solo al primo render (avvio procedure)
  useEffect(() => {
    const start = async () => {
      const result = await initialize();
      if (!result) {
        // errore: interrompe procedura
        return;
      }
      await connect(result.url, result.devId);
    };
    start();
  }, []);

  // eseguito solo al primo render (aggiunge listener)
  useEffect(() => {
    const stateListener = AppState.addEventListener('change', (next) => {
      if (next === 'active' && appState.current.match(/inactive|background/) && browserOpened.current) {
        closePage(router, 0);
      }
      appState.current = next;
    });
    return () => stateListener.remove();
  }, []);

  // visualizzazione pagina
  return (
    <>
      <Stack.Screen options={{ title: 'Apri il registro' }} />

      {stage == 0 && (
        <View style={styles.pageContainer}>
          <Text style={styles.text}>Accesso al registro in corso...</Text>
          <Waiting />
        </View>
      )}

      {stage == 9 && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitleError}>ERRORE</Text>
            <Text style={styles.modalMessage}>{error}</Text>
            <Pressable onPress={() => closePage(router, 0)}>
              <Text style={styles.buttonPrimary}>INDIETRO</Text>
            </Pressable>
          </View>
        </View>
      )}

    </>
  );

}
