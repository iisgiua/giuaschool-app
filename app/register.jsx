/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Pressable from '../components/PressableComponent';
import Waiting from '../components/WaitingComponent';
import { styles } from './_layout';
import RNBiometrics, { KeyType } from 'react-native-easy-biometrics';
// import { createDeviceId } from '../utils/DeviceInfo'; // rimosso: import inutilizzato

const DEVICE_KEY_ALIAS = 'it.iisgiua.giuaschoolapp.device_identity_key';

// Timeout di INATTIVITÀ, non di durata assoluta: viene resettato ad
// ogni cambio di pagina rilevato nella WebView (vedi navigationChanged).
// 3 minuti coprono comodamente anche un login SPID via app, dove
// l'utente esce temporaneamente dall'app per confermare altrove
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;

export default function RegisterScreen() {

  // inizializza
  const [web, setWeb] = useState('');
  const [stage, setStage] = useState(0);
  const [error, setError] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [connectExecuted, setConnectExecuted] = useState(false);

  // User-Agent "onesto" per le chiamate DIRETTE al tuo backend: qui
  // non c'è nessun motivo di dichiararsi un browser desktop, e farlo
  // inquina i log applicativi (vedi discussione sul LoginScreen)
  const backendUserAgent = `GiuaSchoolApp/${Constants.expoConfig.extra.version} (${Platform.OS})`;

  // User-Agent per la WEBVIEW: qui invece la pagina caricata è quella
  // REALE di login SPID/CIE, gestita da un identity provider esterno
  // che potrebbe fare browser-sniffing e rifiutare uno User-Agent non
  // riconosciuto. Se possibile, verifica con l'IdP se esiste un modo
  // di dichiararsi onestamente come app mobile senza essere bloccati;
  // finché non è verificato, mantenere la compatibilità qui ha una
  // giustificazione pratica che non c'era nel LoginScreen
  const webViewUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 ' + Constants.expoConfig.extra.version;

  const router = useRouter();
  const webViewRef = useRef(null);
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);

  const deviceKeyPair = async () => {
    // Elimina un'eventuale coppia di chiavi preesistente sotto lo
    // stesso alias PRIMA di crearne una nuova: senza questo, un
    // secondo tentativo di associazione (dopo revoca o fallimento
    // parziale) farebbe fallire createKeys con l'alias già in uso.
    // deleteKeys non deve interrompere il flusso se non trova nulla
    // da eliminare (prima registrazione in assoluto)
    try {
      await RNBiometrics.deleteKeys(DEVICE_KEY_ALIAS);
    } catch {
      // Nessuna chiave preesistente: comportamento atteso al primo
      // utilizzo, non è un errore da propagare
    }

    const result = await RNBiometrics.createKeys(DEVICE_KEY_ALIAS, KeyType.EC256);

    if (!result?.publicKey) {
      throw new Error('La generazione della coppia di chiavi non ha restituito una chiave pubblica valida.');
    }

    return result.publicKey;
  };

  // Resetta il timeout di inattività: chiamata ad ogni cambio pagina
  // rilevato, così il conto alla rovescia riparte da capo finché
  // l'utente sta effettivamente procedendo nel login, invece di
  // avere una scadenza assoluta fissa dall'inizio della procedura
  const resetInactivityTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setError('Tempo scaduto: non è stata rilevata alcuna attività di login.\nRiprova la procedura di associazione.');
      setStage(9);
      timeoutRef.current = null;
    }, INACTIVITY_TIMEOUT_MS);
  };

  const navigationChanged = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      const urlHome = web;
      const urlProfilo = web + 'login/profilo/';
      if (message.type === 'CLOCK') {
        const url = message.url.endsWith('/') ? message.url : message.url + '/';
        if (url !== currentUrl) {
          setCurrentUrl(url);
          // Ogni cambio di pagina reale è un segnale di progresso:
          // l'utente non è bloccato, quindi ripartiamo il timeout
          resetInactivityTimeout();

          if (url === urlHome || url === urlProfilo) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            setStage(2);
          }
        }
      }
    } catch (err) {
      setError('Errore nella ricezione dei messaggi del dispositivo.\n' + err);
      setStage(9);
    }
  };

  const connect = async () => {
    try {
      const url = web + 'api/auth/register';
      const urlLogout = web + 'logout/';

      // Genera la coppia di chiavi. Se fallisce (inclusi i problemi
      // di formato discussi sopra, o un rifiuto dell'utente se la
      // libreria richiede conferma biometrica anche in creazione),
      // l'eccezione viene ora intercettata dal catch esterno
      const publicKey = await deviceKeyPair();

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'User-Agent': backendUserAgent,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chiavePubblica: publicKey }),
      });

      if (!response.ok) {
        // Distingue esplicitamente il caso più probabile di errore:
        // se la sessione WebView non è stata riconosciuta dal backend
        // (es. il problema di sharedCookiesEnabled discusso sopra),
        // il server risponde tipicamente 401/403
        if (response.status === 401 || response.status === 403) {
          throw new Error('Sessione di login non riconosciuta dal server. Riprova la procedura.');
        }
        throw new Error(`Errore nella registrazione del dispositivo (${response.status}).`);
      }

      const data = await response.json();
      if (!data?.dispositivoId) {
        throw new Error('Il server non ha restituito un identificativo di dispositivo valido.');
      }
      await SecureStore.setItemAsync('dispositivoId', data.dispositivoId);

      // Logout best-effort: un suo fallimento non deve compromettere
      // l'esito della registrazione, già andata a buon fine a questo punto
      try {
        await fetch(urlLogout, {
          method: 'GET',
          headers: { 'User-Agent': backendUserAgent },
        });
      } catch {
        // Non blocchiamo la procedura per un logout non riuscito:
        // la sessione web scadrà comunque per conto suo
      }

      setStage(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStage(9);
    }
  };

  // Innesca connect() UNA SOLA VOLTA all'ingresso nello stage 2,
  // invece di onLayout (che può scattare più volte per lo stesso
  // componente e causare doppie registrazioni)
  useEffect(() => {
    if (stage !== 2 || connectExecuted) {
      return;
    }
    setConnectExecuted(true);
    connect();

  }, [stage, connectExecuted]);

  const start = () => {
    setStage(1);
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

  useEffect(() => {
    const initialize = async () => {
      try {
        const result = await SecureStore.getItem('userData');

        if (!result) {
          throw new Error('Errore nel recupero dei dati memorizzati nel dispositivo.\n');
        }

        const state = JSON.parse(result);
        if (!state.web) {
          throw new Error('Non hai impostato l\'indirizzo web del registro elettronico.\n');
        }

        setWeb(state.web.endsWith('/') ? state.web : state.web + '/');
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setStage(9);
      }
    };

    initialize();

    return () => {
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

  return (
    <>
      <Stack.Screen options={{ title: 'Associa il dispositivo' }} />
      {stage == 0 && (
        <View style={styles.pageContainer}>
          <Text style={styles.text}>
            Questo dispositivo sarà associato al tuo utente sul registro elettronico,
            in modo che non sia più necessario usare le tue credenziali per collegarti.
          </Text>
          <Text style={styles.text}>
            Dovrai ora effettuare il normale accesso al registro elettronico:
            successivamente non fare niente, ma rimani in attesa che l'applicazione prenda il controllo
            per eseguire la registrazione del tuo dispositivo.
          </Text>
          <Pressable style={styles.buttonContainer} onPress={start}>
            <Text style={styles.buttonPrimary}>Associa il dispositivo</Text>
          </Pressable>
        </View>
      )}
      {stage == 1 && (
        <WebView
          source={{ uri: web + 'logout/' }}
          // Fondamentale su iOS: senza questa prop, il cookie di
          // sessione impostato durante il login SPID/CIE nella WebView
          // non è visibile alle chiamate fetch() successive in connect()
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
          userAgent={webViewUserAgent}
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
}
