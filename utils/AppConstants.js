/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import Constants from 'expo-constants';
import { Platform } from 'react-native';


// **
// * Costanti di uso generale per l'applicazione.
// *
// * @author Antonello Dessì
// *
export const APP_CONSTANTS = Object.freeze({
  // identificativo per le chiavi di cifratura
  DEVICE_KEY: 'it.iisgiua.giuaschoolapp.device_identity_key',
  // scadenza in ms per l'attesa dell'avvenuta connessione tramite SPID/CIE (3 minuti tra ogni cambio pagina)
  CONNECT_TIMEOUT: 5 * 60 * 1000,
  // user-agent per le chiamate dirette al backend
  BACKEND_UA: `${Constants.expoConfig.extra.version} (${Platform.OS})`,
  // user-agent per le chiamate tramite WEBVIEW per l'autenticazione SPID/CIE
  WEBVIEW_UA: 'Mozilla/5.0 (Linux x86_64; rv:153.0) Gecko/20100101 Firefox/153.0',
  // URL per la pagina del registro di HOME
  HOME_URL: '',
  // URL per la pagina del registro dei profili
  PROFILE_URL: 'login/profilo/',
  // URL per la pagina del registro per il logout
  LOGIN_URL: 'login/form/',
  // URL per la pagina del registro per il logout
  LOGOUT_URL: 'logout/',
  // URL per la pagina del registro per la registrazione del dispositivo
  REGISTER_URL: 'api/auth/register',
  // URL per la pagina del registro per la revoca della registrazione
  REVOKE_URL: 'api/auth/revoke',
  // URL per la pagina del registro per la richiesta di connessione
  REQUEST_URL: 'api/auth/request',
  // URL per la pagina del registro per la validazione della richiesta di connessione
  VALIDATE_URL: 'api/auth/validate',
  // URL per la pagina del registro per la connession
  CONNECT_URL: 'api/auth/connect?code=',
  // URL per la pagina del registro che fornisce informazioni sull'app in uso
  INFO_URL: 'api/app/version',
  // URL per la pagina del registro con il download dell'app
  DOWNLOAD_URL: 'api/info/app',
  // versione del protocollo di autenticazione
  AUTH_PROTOCOL: 'GS-AUTH-v1',
  // giorni di sospensione dell'avviso per l'aggiornamento di build
  UPDATES_SUPPRESS_DAYS: 15,
});
