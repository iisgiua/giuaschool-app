/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Stack, useRouter } from 'expo-router';
import { ScrollView, Text, View } from "react-native";
import Pressable from '../components/PressableComponent';
import { styles } from "./_layout";


// **
// * Pagina con le informazioni sull'uso dell'app
// *
// * @author Antonello Dessì
// *
export default function AboutScreen() {

  // inizializza
  const router = useRouter();

  // visualizza pagina
  return (
    <ScrollView>
      <Stack.Screen
        options={{
          title: 'Informazioni',
        }}
      />
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.textSmall}>
            Questa applicazione ti permette di accedere al registro elettronico senza preoccuparti più
            delle credenziali di accesso.
            Devi però configurarla nel modo seguente:
          </Text>
          <Text style={styles.textSmall}>
            1 - Vai alla pagina delle impostazioni ed inserisci i dati richiesti.
            Se vuoi, puoi decidere che prima di ogni accesso al registro elettronico ti venga richiesta
            un'autenticazione biometrica sul tuo dispositivo (impronta digitale o altro).
          </Text>
          <Text style={styles.textSmall}>
            2 - Vai alla pagina per associare il dispositivo e segui le indicazioni.
            Dovrai effettuare il normale accesso al registro elettronico, in modo che il tuo dispositivo venga
            registrato.
          </Text>
          <Text style={styles.textSmall}>
            3 - Se hai effettuato i passi precedenti, ora potrai accedere al registro senza credenziali.
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.buttonPrimary}>INDIETRO</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
