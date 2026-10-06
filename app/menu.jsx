/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import Constants from 'expo-constants';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';
import { useCallback, useState } from 'react';
import logo from '../assets/logo.png';
import Pressable from '../components/PressableComponent';
import ScreenContainer from '../components/ScreenContainerComponent';
import { styles } from '../styles/AppStyles';
import { getDeviceId } from '../utils/Storage';


// **
// * Pagina iniziale dell'app
// *
// * @author Antonello Dessì
// *
export default function MenuScreen() {

  // inizializza
  const router = useRouter();
  const [deviceId, setDeviceId] = useState(null);

  // eseguito ogni volta che la pagina va in primo piano
  useFocusEffect(
    useCallback(() => {
      // funzione asincrona interna per leggere il dato
      const read = async () => {
        let url = '';
        try {
          const value = await getDeviceId();
          setDeviceId(value);
        } catch (error) {
          url = `/modal?type=E&title=ATTENZIONE&msg=${encodeURIComponent('Impossibile recuperare le informazioni memorizzate nel dispositivo.')}&ret=0`;
          router.push(url);
        }
      };
      read();
    }, [])
  );

  // visualizza pagina
  return (
    <>
      <Stack.Screen options={{ title: 'Pagina iniziale' }} />

      <ScreenContainer>

        <View style={styles.logoContainer}>
          <Image style={styles.logo}
            source={logo}
          />
          <Text style={styles.logoLabel}>{Constants.expoConfig.extra.version}</Text>
          {Constants.expoConfig.extra.school &&
            <Text style={styles.schoolLabel}>{Constants.expoConfig.extra.school}</Text>
          }
        </View>

        <View style={styles.spacedContainer}>

          <Pressable style={styles.spaced}
            onPress={() => router.push('/connect')}
          >
            <Text style={styles.buttonPrimary}>Apri il registro</Text>
          </Pressable>

          <Pressable style={styles.spaced}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.buttonSecondary}>{ deviceId ? 'Nuova registrazione' : 'Registra il dispositivo' }</Text>
          </Pressable>

          {deviceId &&
            <Pressable style={styles.spaced}
              onPress={() => router.push('/revoke')}
            >
              <Text style={styles.buttonWarning}>Revoca registrazione</Text>
            </Pressable>
          }

          {!Constants.expoConfig.extra.url &&
            <Pressable style={styles.spaced}
              onPress={() => router.push('/settings')}
            >
              <Text style={styles.buttonSecondary}>Impostazioni</Text>
            </Pressable>
          }

          <Pressable style={styles.spaced}
            onPress={() => router.push('/about')}
          >
            <Text style={styles.buttonSecondary}>Informazioni</Text>
          </Pressable>

        </View>

      </ScreenContainer>
    </>
  );

}
