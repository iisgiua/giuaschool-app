/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import Constants from 'expo-constants';
import { useFocusEffect, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useCallback, useState } from 'react';
import Waiting from '../components/WaitingComponent';
import { styles } from '../styles/AppStyles';
import { getDeviceId, getLastUpdateCheck, getWebSite, isAboutSeen, setWebSite } from '../utils/Storage';


// indica se avvio automatico già eseguito
let connectExecuted = false;


// **
// * Pagina iniziale che richiama automaticamente le altre funzioni
// *
// * @author Antonello Dessì
// *
export default function IndexScreen() {

  // inizializza
  const router = useRouter();

  // restituisce la data odierna nel formato YYYY-MM-DD
  const todayString = () => {
    const dt = new Date();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${dt.getFullYear()}-${month}-${day}`;
  };

  // eseguita ogni volta che la pagina torna in primo piano
  useFocusEffect(
    useCallback(() => {
      // controlla se la pagina è attiva
      let isActive = true;
      // procedura che valuta quale funzione eseguire
      const evaluateRoute = async () => {
        try {
          // va alla pagina informativa: solo se mai vista prima
          if (!isAboutSeen()) {
            if (isActive) {
              router.replace('/about');
            }
            return;
          }
          // va alle impostazioni: solo se indirizzo è vuoto
          if (!getWebSite()) {
            if (Constants.expoConfig.extra.url) {
              // salva URL precompilata e continua il flusso di controllo
              await setWebSite(Constants.expoConfig.extra.url);
            } else {
              if (isActive) {
               router.replace('/settings');
              }
              return;
            }
          }
          // va alla registrazione: solo se dispositivo non registrato
          if (!getDeviceId()) {
            if (isActive) {
              router.replace('/register');
            }
            return;
          }
          // controllo aggiornamenti: solo una volta al giorno
          if (getLastUpdateCheck() !== todayString()) {
            if (isActive) {
              router.replace('/updates');
            }
            return;
          }
          // accesso automatico al registro: solo se non ancora eseguito dall'avvio dell'app
          if (!connectExecuted) {
            connectExecuted = true;
            if (isActive) {
              router.replace('/connect');
            }
            return;
          }
          // va al menu in ogni altro caso
          if (isActive) {
            router.replace('/menu');
          }
        } catch (err) {
          // errore dati illeggibili: va al menu
          if (isActive) {
            router.replace('/menu');
          }
        }
      };
      // esegue procedura di indirizzamento alle pagine
      evaluateRoute();
      return () => {
        isActive = false;
      };
    }, [])
  );

  // visualizzazione pagina
  return (
    <View style={styles.pageContainer}>
      <Waiting />
    </View>
  );

}
