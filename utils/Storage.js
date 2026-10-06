/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import * as SecureStore from 'expo-secure-store';


// **
// * Funzioni per l'accesso ai dati nello SecureStore
// *
// * @author Antonello Dessì
// *

// Chiavi usate con expo-secure-store.
export const STORAGE_KEYS = Object.freeze({
  // identificativo del dispositivo registrato
  DEVICE_ID: 'device_id',
  // indirizzo web del registro elettronico
  WEB_SITE: 'web_site',
  // indica se è stato vista la pagina informativa
  ABOUT_SEEN: 'about_seen',
  // data (YYYY-MM-DD) dell'ultimo controllo degli aggiornamenti
  LAST_UPDATE_CHECK: 'last_update_check',
  // data (YYYY-MM-DD) dell'ultimo avviso mostrato all'utente sugli aggiornamenti
  LAST_UPDATE_NOTICE: 'last_update_notice',
});


// restituisce l'identificativo del dispositivo
export const getDeviceId = () => {
  return SecureStore.getItem(STORAGE_KEYS.DEVICE_ID);
};

// modifica l'identificativo del dispositivo
export const setDeviceId = (id) => {
  return SecureStore.setItemAsync(STORAGE_KEYS.DEVICE_ID, id);
};

// rimuove l'identificativo del dispositivo (revoca del dispositivo)
export const clearDeviceId = () => {
  return SecureStore.deleteItemAsync(STORAGE_KEYS.DEVICE_ID);
};

// restituisce l'indirizzo web del registro
export const getWebSite = () => {
  return SecureStore.getItem(STORAGE_KEYS.WEB_SITE);
};

// modifica l'indirizzo web del registro
export const setWebSite = (url) => {
  return SecureStore.setItemAsync(STORAGE_KEYS.WEB_SITE, url);
};

// indica se è stata vista la pagina informativa
export const isAboutSeen = () => {
  return !!SecureStore.getItem(STORAGE_KEYS.ABOUT_SEEN);
};

// imposta come vista la pagina informativa
export const setAboutSeen = () => {
  return SecureStore.setItemAsync(STORAGE_KEYS.ABOUT_SEEN, 'true');
};

// restituisce la data dell'ultimo controllo degli aggiornamenti (formato YYYY-MM-DD)
export const getLastUpdateCheck = () => {
  return SecureStore.getItem(STORAGE_KEYS.LAST_UPDATE_CHECK);
};

// imposta la data dell'ultimo controllo degli aggiornamenti (formato YYYY-MM-DD)
export const setLastUpdateCheck = (dateString) => {
  return SecureStore.setItemAsync(STORAGE_KEYS.LAST_UPDATE_CHECK, dateString);
};

// data (YYYY-MM-DD) dell'ultimo avviso mostrato all'utente sugli aggiornamenti
export const getLastUpdateNotice = () => {
  return SecureStore.getItem(STORAGE_KEYS.LAST_UPDATE_NOTICE);
};

// imposta la data (YYYY-MM-DD) dell'ultimo avviso mostrato all'utente sugli aggiornamenti
export const setLastUpdateNotice = (dateString) => {
  return SecureStore.setItemAsync(STORAGE_KEYS.LAST_UPDATE_NOTICE, dateString);
};
