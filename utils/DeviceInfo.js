/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';


// **
// * Funzione per generare un codice univoco per il dispositivo
// *
// * @author Antonello Dessì
// *
export async function createDeviceId() {
  // info sul dispositivo
  const info =
    Device.brand + '/' +
    Device.modelName + '/' +
    Device.deviceType + '/' +
    Device.deviceYearClass + '/' +
    Device.osName + '/' +
    Device.osVersion + '/' +
    Device.osBuildId + '/' +
    Device.osInternalBuildId;
  // crea impronta
  const token = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, info);
  // restituisce impronta
  return token;
}
