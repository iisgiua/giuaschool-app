/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


// **
// * Funzione per chiudere la pagina corrente in modo corretto in diversi contesti.
// *
// * @author Antonello Dessì
// *
export const closePage = (router, ret) => {
  if (ret == 1) {
    // forza il ritorno alla pagina radice
    router.replace('/');
  } else if (router.canGoBack()) {
    // ritorna alla pagina precedente
    router.back();
  } else {
    // ritorna alla pagina radice
    router.replace('/');
  }
};
