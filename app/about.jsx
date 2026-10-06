/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import { Image, Text, View } from "react-native";
import { useState } from 'react';
import logo from '../assets/logo.png';
import Pressable from '../components/PressableComponent';
import ScreenContainer from '../components/ScreenContainerComponent';
import { styles } from '../styles/AppStyles';
import { closePage } from '../utils/Navigation';
import { setAboutSeen } from '../utils/Storage';


// **
// * Pagina con le informazioni sull'uso dell'app
// *
// * @author Antonello Dessì
// *
export default function AboutScreen() {

  // inizializza
  const [page, setPage] = useState(1);
  const router = useRouter();

  // restituisce la data odierna nel formato YYYY-MM-DD
  const exit = async () => {
    // memorizza la visualizzazione della pagina informativa
    await setAboutSeen();
    // esce dalla pagina
    closePage(router, 0);
  };

  // visualizza pagina
  return (
    <>
      <Stack.Screen options={{ title: 'Informazioni' }} />

      <ScreenContainer>

        <View style={styles.logoSmallContainer}>
          <View style={styles.rowContainer}>
            <Image style={styles.logoSmall}
              source={logo}
            />
            <Text style={styles.logoLabel}>{Constants.expoConfig.extra.version}</Text>
          </View>
        </View>

        {page == 1 && (
          <>
            <Text style={styles.title}>A cosa serve questa app</Text>
            <Text style={styles.textSmallBold}>
              Accedi più velocemente al registro elettronico, senza perdere sicurezza.
            </Text>
            <Text style={styles.textSmall}>
              Normalmente, per entrare nel registro elettronico devi inserire ogni volta le tue credenziali
              o usare la tua identità digitale (SPID o Carta di Identità Elettronica).
              Se associ questo dispositivo al tuo utente, ti basterà usare l'impronta digitale
              o il riconoscimento del volto: non dovrai più digitare nulla.
            </Text>
            <Text style={styles.textSmall}>
              È un sistema sicuro: solo tu, con il tuo dispositivo sbloccato dalla tua impronta o dal tuo volto,
              puoi accedere al registro.
            </Text>
            <Text style={styles.textSmall}>
              I tuoi dati biometrici restano sempre sul telefono e non vengono mai inviati alla scuola o a terzi.
            </Text>
          </>
        )}

        {page == 2 && (
          <>
            <Text style={styles.title}>Come si registra il dispositivo</Text>
            <Text style={styles.textSmallBold}>
              La procedura di registrazione partirà in automatico la prima volta che esegui l'applicazione.
            </Text>
            <Text style={styles.textSmall}>
              Puoi anche avviare la registrazione con il pulsante "Registra il dispositivo".
              Ti verrà chiesto di effettuare il normale accesso al registro elettronico, quindi dovrai
              attendere che l'applicazione prenda il controllo per effettuare automaticamente la registrazione.
            </Text>
            <Text style={styles.textSmall}>
              Puoi associare un solo dispositivo: se registri un nuovo telefono, quello precedente
              smette automaticamente di autorizzare l'accesso.
            </Text>
            <Text style={styles.textSmall}>
              Se cambi telefono o disinstalli l'app, dovrai ripetere la procedura di registrazione.
            </Text>
          </>
        )}

        {page == 3 && (
          <>
            <Text style={styles.title}>Revoca e scadenza della registrazione</Text>
            <Text style={styles.textSmallBold}>
              Puoi revocare in qualsiasi momento  l'associazione del dispositivo.
            </Text>
            <Text style={styles.textSmall}>
              Con il pulsante "Revoca registrazione" puoi cancellare
              l'associazione del tuo utente con questo dispositivo.
              Ti verrà chiesto di effettuare il normale accesso al registro elettronico, quindi dovrai
              attendere che l'applicazione prenda il controllo per effettuare automaticamente la revoca.
            </Text>
            <Text style={styles.textSmallBold}>
              La registrazione non dura per sempre, ma ha una scadenza.
            </Text>
            <Text style={styles.textSmall}>
              Per una questione di sicurezza, la registrazione ha una durata limitata, seppure si sia scelto di
              estenderla il più possibile. Alla scadenza ti verrà chiesto di ripetere la registrazione.
            </Text>
          </>
        )}

        <View style={styles.buttonContainer}>
          <Pressable style={styles.spaced}
            onPress={() => page < 3 ? setPage(page + 1) : exit()}
          >
            <Text style={styles.buttonPrimary}>{ page < 3 ? 'AVANTI  >>' : 'CHIUDI'}</Text>
          </Pressable>
        </View>

      </ScreenContainer>
    </>
  );

}
