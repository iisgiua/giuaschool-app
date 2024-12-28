/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { Modal, Text, View } from 'react-native';
import Pressable from '../components/PressableComponent';
import { styles } from './_layout';


// **
// * Pagina di visualizzazione messaggi
// *  Parametri:
// *    type:   E=errore, S=successo, M=messaggio
// *    title:  testo dell'intestazione
// *    msg:    testo del messaggio
// *
// * @author Antonello Dessì
// *
export default function ModalScreen() {

  // inizializza
  const router = useRouter();
  const { type, title, msg } = useLocalSearchParams(); // estrae parametri

  // visualizza pagina
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={true}
      onRequestClose={() => router.back()}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={type == 'E' ? styles.modalTitleError : (type == 'S' ? styles.modalTitleSuccess : styles.modalTitle)}>{title}</Text>
          <Text style={styles.modalMessage}>{msg}</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.buttonPrimary}>CHIUDI</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
