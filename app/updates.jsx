/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import { Linking, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import Pressable from '../components/PressableComponent';
import Waiting from '../components/WaitingComponent';
import { styles } from '../styles/AppStyles';
import { APP_CONSTANTS } from '../utils/AppConstants';
import { closePage } from '../utils/Navigation';
import { getLastUpdateNotice, getWebSite, setLastUpdateCheck, setLastUpdateNotice } from '../utils/Storage';


// **
// * Pagina per il controllo degli aggiornamenti dell'app e del protocollo.
// *
// * @author Antonello Dessì
// *
export default function UpdatesScreen() {

  // inizializza
  const [stage, setStage] = useState(0);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // restituisce la data odierna nel formato YYYY-MM-DD
  const todayString = () => {
    const dt = new Date();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${dt.getFullYear()}-${month}-${day}`;
  };

  // scompone stringa versione nelle varie componenti (major, minor e build)
  const parseVersion = (v) => {
    const parts = String(v ?? '0.0.0').split('.').map((n) => parseInt(n, 10) || 0);
    return { major: parts[0] ?? 0, minor: parts[1] ?? 0, build: parts[2] ?? 0 };
  };

  // restituisce il numero di giorni trascorsi dalla data indicata ad oggi
  const daysSince = (from) => {
    if (!from) {
      // se data non definita restuisce il limite previsto
      return APP_CONSTANTS.UPDATES_SUPPRESS_DAYS;
    }
    const msPerDay = 24 * 60 * 60 * 1000;
    const a = new Date(from + 'T00:00:00');
    const b = new Date(todayString() + 'T00:00:00');
    return Math.round((b - a) / msPerDay);
  };

  // mostra su browser esterno la pagina del download
  const pageDownload = async () => {
    try {
      await Linking.openURL(getWebSite() + APP_CONSTANTS.DOWNLOAD_URL);
    } catch {
      // se il browser non si apre, l'utente resta sulla schermata
      // corrente e può ritentare manualmente
    }
  };

  // eseguito solo al primo render
  useEffect(() => {
    const run = async () => {
      // imposta url API
      const infoUrl = getWebSite() + APP_CONSTANTS.INFO_URL;
      // imposta come eseguito il controllo, anche se potessero verificarsi errori successivi
      await setLastUpdateCheck(todayString());
      try {
        // legge info su versione app
        const response = await fetch(infoUrl, {
          method: 'POST',
          headers: {
            'User-Agent': APP_CONSTANTS.BACKEND_UA,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ }),
        });
        // legge risposta
        if (!response.ok) {
          // errore
          throw new Error(`[${response.status}]`);
        }
        const data = await response.json();
        // controllo versione protocollo di autenticazione
        if (data.protocollo !== APP_CONSTANTS.AUTH_PROTOCOL) {
          // messaggio bloccante
          setMessage(
            'Il protocollo di autenticazione di questa versione dell\'app ' +
            'non è più supportato dal server.\n\n' +
            'Devi scaricare una nuova versione dell\'app per continuare.');
          setStage(1);
          return;
        }
        // controllo versione
        const remote = parseVersion(data.versione);
        const local = parseVersion(Constants.expoConfig.version);
        // controllo versione major
        if (remote.major > local.major) {
          // messaggio bloccante
          setMessage(
            'È disponibile una nuova versione dell\'app.\n\n' +
            'Devi scaricare l\'aggiornamento per poter accedere al registro.');
          setStage(1);
          return;
        }
        // controllo versione minor
        if (remote.major === local.major && remote.minor > local.minor) {
          // messaggio non bloccante
          setMessage(
            'È disponibile una nuova versione dell\'app con importanti modifiche.\n\n' +
            'Ti consigliamo di aggiornarla al più presto.');
          setStage(2);
          return;
        }
        // controllo versione build
        if (remote.major === local.major && remote.minor === local.minor && remote.build > local.build) {
          const days = daysSince(getLastUpdateNotice());
          if (days >= APP_CONSTANTS.UPDATES_SUPPRESS_DAYS) {
            // memorizza dati di notifica
            await setLastUpdateNotice(todayString());
            // messaggio non bloccante
            setMessage('È disponibile un aggiornamento dell\'app.');
            setStage(2);
            return;
          }
          // avviso già mostrato di recente: prosegue senza interrompere
        }
        // nessun avviso da mostrare
        closePage(router, 0);
      } catch (err) {
        // errore di rete o altro: nessun messaggio
        closePage(router, 0);
      }
    };
    run();
  }, []);

  // visualizzazione pagina
  return (
    <>
      <Stack.Screen options={{ title: 'Controllo aggiornamenti' }} />

      {stage === 0 && (
        <View style={styles.pageContainer}>
          <Text style={styles.text}>Controllo aggiornamenti in corso...</Text>
          <Waiting />
        </View>
      )}

      {stage === 1 && ( // Messaggio bloccante: nessun pulsante per proseguire
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitleError}>AGGIORNAMENTO NECESSARIO</Text>
            <Text style={styles.modalMessage}>{message}</Text>
            <Pressable onPress={pageDownload}>
              <Text style={styles.buttonPrimary}>SCARICA APP</Text>
            </Pressable>
          </View>
        </View>
      )}

      {stage === 2 && ( // Messaggio non bloccante
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitleSuccess}>AGGIORNAMENTO DISPONIBILE</Text>
            <Text style={styles.modalMessage}>{message}</Text>
            <Pressable style={styles.spaced}
              onPress={pageDownload}
            >
              <Text style={styles.buttonPrimary}>SCARICA APP</Text>
            </Pressable>
            <Pressable style={styles.spaced}
              onPress={() => closePage(router, 0)}
            >
              <Text style={styles.buttonSecondary}>CONTINUA</Text>
            </Pressable>
          </View>
        </View>
      )}

    </>
  );

}
