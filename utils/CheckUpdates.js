/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';


// **
// * Funzione che restituisce VERO se esistono aggiornamenti per l'app, FALSO altrimenti
// *
// * @author Antonello Dessì
// *
export const checkUpdates = async () => {
  try {
    // legge la data attuale
    const current = currentDate();
    // legge ultima data
    const lastCheck = await SecureStore.getItemAsync('updates');
    if (lastCheck) {
      // un controllo al mese
      if (lastCheck >= current) {
        // esce
        return false;
      }
    }
    // effettua controllo di versione
    const url = 'https://api.github.com/repos/iisgiua/giuaschool-app/tags';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Impossibile verificare gli aggiornamenti dell\'applicazione.\n' + response.status);
    }
    const data = await response.json();
    if (data.length == 0) {
      throw new Error('Impossibile verificare gli aggiornamenti dell\'applicazione.\n');
    }
    // aggiorna la data di controllo
    await SecureStore.setItemAsync('updates', current);
    // confronta le versioni
    const lastTag = data[0].name;
    const currentVersion = 'v' + Constants.expoConfig.version;
    return (currentVersion !== lastTag);
  } catch (error) {
    // controllo fallito
    return false;
  }
};

// **
// * Funzione che restituisce la data attuale nel formato YYYY-MM
// *
// * @author Antonello Dessì
// *
export const currentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};
