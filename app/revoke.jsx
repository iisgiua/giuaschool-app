/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import { Stack, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import RNBiometrics from 'react-native-easy-biometrics';
import { WebView } from 'react-native-webview';
import { useEffect, useRef, useState } from 'react';
import Pressable from '../components/PressableComponent';
import Waiting from '../components/WaitingComponent';
import { styles } from '../styles/AppStyles';
import { APP_CONSTANTS } from '../utils/AppConstants';
import { closePage } from '../utils/Navigation';
import { getWebSite, clearDeviceId, getDeviceId } from '../utils/Storage';


// **
// * Pagina per la procedura di revoca del dispositivo.
// *
// * @author Antonello Dessì
// *
export default function RevokeScreen() {

  // inizializza
  const [web, setWeb] = useState('');
  const [device, setDevice] = useState('');
  const [stage, setStage] = useState(0);
  const [error, setError] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [revokeExecuted, setRevokeExecuted] = useState(false);
  const router = useRouter();
  const webViewRef = useRef(null);
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);

  // resetta il timeout di inattività ad ogni cambio pagina
  const resetInactivityTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      timeoutRef.current = null;
      setError('Tempo scaduto: non è stata rilevato l\'accesso al registro elettronico.\n\nRiprova la procedura di revoca della registrazione.');
      setStage(9);
    }, APP_CONSTANTS.CONNECT_TIMEOUT);
  };

  // evento eseguito per il controllo della navigazione della WEBVIEW
  const navigationChanged = (event) => {
    const homeUrl = web + APP_CONSTANTS.HOME_URL;
    const profileUrl = web + APP_CONSTANTS.PROFILE_URL;
    try {
      const message = JSON.parse(event.nativeEvent.data);
      // solo evento CLOCK è rilevante
      if (message.type === 'CLOCK') {
        const url = message.url.endsWith('/') ? message.url : message.url + '/';
        // controlla se cambio pagina
        if (url !== currentUrl) {
          // memorizza nuova pagina
          setCurrentUrl(url);
          // resetta il timer di inattività
          resetInactivityTimeout();
          // controlla se è stato completato il login
          if (url === homeUrl || url === profileUrl) {
            // login avvenuto con successo: cancella i timer
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            // va al passo successivo
            setStage(2);
          }
        }
      }
    } catch (err) {
      setError('Impossibile rilevare l\'accesso al registro elettronico.\n\n' +
        (err instanceof Error ? err.message : String(err)));
      setStage(9);
    }
  };

  // procedura di revoca del dispositivo
  const revoke = async () => {
    const revokeUrl = web + APP_CONSTANTS.REVOKE_URL;
    const logoutUrl = web + APP_CONSTANTS.LOGOUT_URL;
    try {
      // elimina la coppia di chiavi di cifratura
      try {
        await RNBiometrics.deleteKeys(APP_CONSTANTS.DEVICE_KEY);
      } catch {
        // nessuna chiave preesistente: nessun errore
      }
      const response = await fetch(revokeUrl, {
        method: 'POST',
        headers: {
          'User-Agent': APP_CONSTANTS.BACKEND_UA,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dispositivoId: device }),
      });
      if (!response.ok) {
        // impossibile eseguire la revoca: se il server risponde con codice 401/403
        // può essere che la sessione WEBVIEW non sia stata condivisa con il FETCH
         throw new Error(`[${response.status}]`);
      }
      // va al passo successivo
      setStage(3);
    } catch (err) {
      setError("Errore nella revoca della registrazione.\nRiprova più tardi.\n\n" +
        (err instanceof Error ? err.message : String(err)));
      setStage(9);
    } finally {
      // disconnette l'utente
      try {
        await fetch(logoutUrl, {
          method: 'GET',
          headers: { 'User-Agent': APP_CONSTANTS.BACKEND_UA },
        });
      } catch {
        // errore sul logout, utente forse già disconesso: non fa nulla
      }
      // elimina l'identificativo del dispositivo
      try {
        await clearDeviceId();
      } catch {
        // errore sulla rimozione dell'identificativo del dispositivo: non fa nulla
      }
    }
  };

  // fa partire la procedura di revoca
  const start = () => {
    // imposta il passo successivo
    setStage(1);
    // inizializza i timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CLOCK', url: window.location.href }));
          true;
        `);
      }
    }, 500);
    resetInactivityTimeout();
  };

  // eseguito solo al primo render
  useEffect(() => {
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
          throw new Error('L\'identificativo del dispositivo non è presente.\n\nForse la registrazione è già stata revocata.');
        }
        // memorizza l'identificativo del dispositivo
        setDevice(devId);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setStage(9);
      }
    };
    initialize();
    return () => {
      // azzera i timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // eseguito ad ogni modifica delle variabili: stage, revokeExecuted
  // impedisce che la revoca possa essere eseguita più volte
  useEffect(() => {
    if (stage !== 2 || revokeExecuted) {
      // non è il passo 2 oppure la revoca è stata già eseguita
      return;
    }
    // segna la revoca avventa
    setRevokeExecuted(true);
    // esegue la revoca
    revoke();
  }, [stage, revokeExecuted]);

  // visualizza pagina
  return (
    <>
      <Stack.Screen options={{ title: 'Revoca il dispositivo' }} />

      {stage == 0 && (
        <View style={styles.pageContainer}>
          <Text style={styles.text}>
            La registrazione di questo dispositivo sul registro elettronico sarà revocata,
            annullando l'associazione con il tuo utente.
          </Text>
          <Text style={styles.text}>
            Ora esegui il normale accesso al registro elettronico usando le tue credenziali,
            poi rimani in attesa che l'applicazione prenda il controllo
            per completare la revoca della registrazione.
          </Text>
          <Pressable style={styles.buttonContainer} onPress={start}>
            <Text style={styles.buttonPrimary}>Revoca la registrazione</Text>
          </Pressable>
        </View>
      )}

      {stage == 1 && (
        <WebView
          source={{ uri: web + APP_CONSTANTS.LOGIN_URL }}
          // condivisione della sessione tra WEBVIEW e FETCH (fondamentale su iOS)
          sharedCookiesEnabled={true}
          onError={(event) => {
            setError('Errore di connessione\n' + event.nativeEvent.description);
            setStage(9);
          }}
          onHttpError={(event) => {
            setError('Errore di connessione\n' + event.nativeEvent.description);
            setStage(9);
          }}
          onMessage={navigationChanged}
          startInLoadingState={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          userAgent={APP_CONSTANTS.WEBVIEW_UA}
          renderLoading={() => <Waiting />}
          ref={webViewRef}
        />
      )}

      {stage == 2 && (
        <View style={styles.pageContainer}>
          <Waiting />
        </View>
      )}

      {stage == 3 && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitleSuccess}>REGISTRAZIONE REVOCATA</Text>
            <Text style={styles.modalMessage}>La procedura di revoca della registrazione è stata eseguita correttamente.</Text>
            <Pressable onPress={() => closePage(router, 0)}>
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
            <Pressable onPress={() => closePage(router, 0)}>
              <Text style={styles.buttonPrimary}>INDIETRO</Text>
            </Pressable>
          </View>
        </View>
      )}

    </>
  );

}
