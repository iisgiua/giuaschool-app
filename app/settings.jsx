/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import { Stack, useRouter } from 'expo-router';
import { Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';
import Pressable from '../components/PressableComponent';
import { styles } from '../styles/AppStyles';
import { closePage } from '../utils/Navigation';
import { getWebSite, setWebSite } from '../utils/Storage';


// **
// * Pagina per la memorizzazione delle impostazioni
// *
// * @author Antonello Dessì
// *
export default function SettingsScreen() {

  // inizializza
  const [web, setWeb] = useState(null);
  const router = useRouter();

  // controlla e salva le impostazioni
  const submit = async () => {
    // esegue controlli sulle impostazioni
    let url = '';
    if (!web) {
      // errore: indirizzo web vuoto
      url = `/modal?type=E&title=ATTENZIONE&msg=${encodeURIComponent('Non hai indicato l\'indirizzo web del registro elettronico.')}&ret=0`;
    } else if (!web.toLowerCase().startsWith('https://')) {
      // errore: indirizzo web non valido
      url = `/modal?type=E&title=ATTENZIONE&msg=${encodeURIComponent('L\'indirizzo web indicato non è valido.')}&ret=0`;
    } else {
      // impostazioni corrette
      let webUrl = web.slice(0, 5).toLowerCase() + web.slice(5);
      if (!webUrl.endsWith('/')) {
        // l'indirizzo deve terminare con '/'
        webUrl = webUrl + '/';
        setWeb(webUrl);
      }
      // memorizza dati
      await setWebSite(webUrl);
      url = `/modal?type=S&title=${encodeURIComponent('DATI SALVATI')}&msg=${encodeURIComponent('La memorizzazione delle impostazioni sul dispositivo è avvenuta senza errori.')}&ret=1`;
    }
    // mostra messaggio
    router.push(url);
  };

  // eseguito solo al primo render
  useEffect(() => {
    let url = '';
    try {
      url = getWebSite();
      if (!url) {
        url = 'https://';
      }
      setWeb(url);
    } catch (error) {
      url = `/modal?type=E&title=ATTENZIONE&msg=${encodeURIComponent('Impossibile recuperare le informazioni memorizzate nel dispositivo.')}&ret=0`;
      router.push(url);
    }
  }, []);

  // visualizza pagina
  return (
    <View style={styles.pageContainer}>

      <Stack.Screen options={{ title: 'Impostazioni' }} />

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Indirizzo web del registro elettronico:</Text>
        <TextInput style={styles.inputField}
          onChangeText={(val) => setWeb(val.replace(/\s/g, '') )}
          value={web}
        />
      </View>

      <View style={styles.buttonGroup}>
        <Pressable onPress={submit}>
          <Text style={styles.buttonPrimary}>SALVA</Text>
        </Pressable>
        <Pressable onPress={() => closePage(router, 0)}>
          <Text style={styles.buttonSecondary}>ANNULLA</Text>
        </Pressable>
      </View>

    </View>
  );

}
