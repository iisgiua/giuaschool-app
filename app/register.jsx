/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import { Stack, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import RNBiometrics, { KeyType } from 'react-native-easy-biometrics';
import { WebView } from 'react-native-webview';
import { AppState } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Pressable from '../components/PressableComponent';
import Waiting from '../components/WaitingComponent';
import { styles } from '../styles/AppStyles';
import { APP_CONSTANTS } from '../utils/AppConstants';
import { closePage } from '../utils/Navigation';
import { getWebSite, setDeviceId } from '../utils/Storage';


// **
// * Pagina per la procedura di registrazione del dispositivo.
// *
// * @author Antonello Dessì
// *
export default function RegisterScreen() {

  // inizializza
  const [web, setWeb] = useState('');
  const [stage, setStage] = useState(0);
  const [error, setError] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [registerExecuted, setRegisterExecuted] = useState(false);
  const [biometricsReady, setBiometricsReady] = useState(null);
  const router = useRouter();
  const webViewRef = useRef(null);
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);

  // effettua il controllo dello stato del sensore
  const checkBiometrics = async () => {
    if (stage !== 0) {
      // evita che sia eseguito in altri passi della registrazione
      return;
    }
    // legge lo stato del sensore biometrico
    const status = await RNBiometrics.getStatus();
    if (status.available && status.enrolled) {
      // sensore compatibile e presenza di dati biometrici
      setBiometricsReady('ok');
      return;
    }
    // sensore non compatibile o non presente
    setBiometricsReady('none');
  };

  // crea la coppia di chiavi di cifratura e restituisce la chiave pubblica
  const deviceKeyPair = async () => {
    // elimina un'eventuale coppia di chiavi preesistente
    try {
      await RNBiometrics.deleteKeys(APP_CONSTANTS.DEVICE_KEY);
    } catch {
      // nessuna chiave preesistente: nessun errore
    }
    // crea la nuova coppia di chiavi di cifratura
    const result = await RNBiometrics.createKeys(APP_CONSTANTS.DEVICE_KEY, KeyType.EC256);
    // controlla che le chiavi generate
    if (!result?.publicKey) {
      throw new Error('La generazione del certificato digitale del dispositivo è fallita.');
    }
    // restituisce la nuova chiave pubblica
    return result.publicKey;
  };

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
      setError('Tempo scaduto: non è stato rilevato l\'accesso al registro elettronico.\n\nRiprova la procedura di registrazione del dispositivo.');
      setStage(9);
    }, APP_CONSTANTS.CONNECT_TIMEOUT);
  };

  // ferma i timer
  const stopTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
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
            stopTimers();
            // va al passo successivo
            setStage(2);
          }
        }
      }
    } catch (err) {
      stopTimers();
      setError('Impossibile rilevare l\'accesso al registro elettronico.\n\n' +
        (err instanceof Error ? err.message : String(err)));
      setStage(9);
    }
  };

  // procedura di registrazione del dispositivo
  const register = async () => {
    const registerUrl = web + APP_CONSTANTS.REGISTER_URL;
    const logoutUrl = web + APP_CONSTANTS.LOGOUT_URL;
    try {
      // genera la coppia di chiavi di cifratura e memorizza la chiave pubblica
      const publicKey = await deviceKeyPair();
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'User-Agent': APP_CONSTANTS.BACKEND_UA,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chiavePubblica: publicKey }),
      });
      if (!response.ok) {
        // impossibile eseguire la registrazione: se il server risponde con codice 401/403
        // può essere che la sessione WEBVIEW non sia stata condivisa con il FETCH
         throw new Error(`[${response.status}]`);
      }
      const data = await response.json();
      if (!data?.dispositivoId) {
        // errore nei dati restituiti
        throw new Error('[101]');
      }
      // memorizza l'identificativo del dispositivo
      await setDeviceId(data.dispositivoId);
      // va al passo successivo
      setStage(3);
    } catch (err) {
      setError("Errore nella registrazione del dispositivo.\nRiprova più tardi.\n\n" +
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
    }
  };

  // fa partire la procedura di registrazione
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

  // eseguito solo al primo render (inizializzazione)
  useEffect(() => {
    const initialize = async () => {
      let url = '';
      try {
        // legge URL del registro elettronico
        url = getWebSite();
        if (!url) {
          // errore: URL del registro elettronico non presente
          throw new Error('Non hai impostato l\'indirizzo web del registro elettronico.\n');
        }
        // memorizza l'URL del registro elettronico
        setWeb(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setStage(9);
      }
    };
    initialize();
    return () => {
      // resetta i timer
      stopTimers();
    };
  }, []);

  // eseguito solo ogni volta che torna in primo piano
  useEffect(() => {
    const listener = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        checkBiometrics();
      }
    });
    checkBiometrics();
    return () => listener.remove();
  }, []);

  // eseguito ad ogni modifica delle variabili: stage, registerExecuted
  // impedisce che la registrazione possa essere eseguita più volte
  useEffect(() => {
    if (stage !== 2 || registerExecuted) {
      // non è il passo 2 oppure la registrazione è stata già eseguita
      return;
    }
    // segna la registrazione avventa
    setRegisterExecuted(true);
    // esegue la registrazione
    register();
  }, [stage, registerExecuted]);

  // visualizza pagina
  return (
    <>
      <Stack.Screen options={{ title: 'Registra il dispositivo' }} />

      {stage == 0 && (
        <View style={styles.pageContainer}>
          {biometricsReady === null && (
            <Waiting />
          )}

          {biometricsReady === 'none'  && (
            <>
              <Text style={styles.text}>
                Questo telefono non dispone di un metodo di autenticazione biometrica compatibile.
              </Text>
              <Text style={styles.text}>
                Per usare l'app, devi configurare nel telefono l'uso delle impronte digitali o
                del riconoscimento del volto.{"\n\n"}
                Spesso il riconoscimento del volto non offre una protezione adeguata:
                pertanto su molti telefoni non viene riconosciuto come autenticazione biometrica utilizzabile.
              </Text>
              <Text style={styles.title}>
                Chiudi l'app, apri le impostazioni del telefono, configura l'impronta digitale
                o il riconoscimento del volto, quindi riprova la registrazione.
              </Text>
            </>
          )}

          {biometricsReady === 'ok' && (
            <>
              <Text style={styles.text}>
                Questo dispositivo sarà associato al tuo utente sul registro elettronico
                tramite un apposito certificato digitale.
              </Text>
              <Text style={styles.text}>
                Ora esegui il normale accesso al registro elettronico usando le tue credenziali,
                poi rimani in attesa che l'applicazione prenda il controllo
                per completare la registrazione del dispositivo.
              </Text>
              <Pressable style={styles.buttonContainer} onPress={start}>
                <Text style={styles.buttonPrimary}>Registra il dispositivo</Text>
              </Pressable>
            </>
          )}

        </View>
      )}

      {stage == 1 && (
        <WebView
          source={{ uri: web + APP_CONSTANTS.LOGIN_URL }}
          // condivisione della sessione tra WEBVIEW e FETCH (fondamentale su iOS)
          sharedCookiesEnabled={true}
          onError={(event) => {
            stopTimers();
            setError('Errore di connessione\n' + event.nativeEvent.description);
            setStage(9);
          }}
          onHttpError={(event) => {
            stopTimers();
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
            <Text style={styles.modalTitleSuccess}>DISPOSITIVO REGISTRATO</Text>
            <Text style={styles.modalMessage}>La procedura di registrazione del dispositivo è stata eseguita correttamente.</Text>
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
