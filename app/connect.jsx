import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Pressable from '../components/PressableComponent';
import Waiting from '../components/WaitingComponent';
import { createDeviceId } from '../utils/DeviceInfo';
import { styles } from './_layout';


// associa dispositivo al registro
export default function ConnectScreen() {

  // inizializza
  const [web, setWeb] = useState('');
  const [device, setDevice] = useState('');
  const [stage, setStage] = useState(0);
  const [error, setError] = useState('');
  const webViewRef = useRef(null);

  // gestione cambio pagina
  const navigationChanged = (event) => {
    const url = event.url + (event.url.endsWith('/') ? '' : '/');
    if (url == web) {
      // login effettuato con successo
      setStage(2);
    }
  };

  // connessione app
  const connect = async () => {

    setError('Ok, connect');
    setStage(9);

    console.warn('connect: ' + device);
    const url = web + 'app/device';
    const urlLogout = web + 'logout/';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246 giua@school/app 3.1',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: device })
    });
    if (response.ok) {
      // Get JSON value from the response body
      const data = await response.json();
      SecureStore.setItem('token', data['token']);
      await fetch(urlLogout, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246 giua@school/app 3.1',
        },
      });
      console.warn('risposta: ', data['token']);
      setStage(3);
    } else {
      setStage(4);
      console.warn('errore risposta: ', response);
    }

  }

  // eseguito solo al primo render
  useEffect(() => {
    // legge dati dalla memoria
    const result = SecureStore.getItem('userData');
    if (result) {
      const state = JSON.parse(result);
      setWeb(state.web);
    }
    // crea codice univoco per il dispositivo
    createDeviceId()
      .then((id) => {
        setDevice(id);
      });
  }, []);

  // visualizza pagina
  return (
    <View style={styles.pageContainer}>
      <Stack.Screen
        options={{
          title: 'Associa il dispositivo',
        }}
      />
      {stage == 0 && (
        <View>
          <Text style={styles.text}>
            Questo dispositivo sarà associato al tuo utente sul registro elettronico,
            in modo che non sia più necessario usare le tue credenziali per collegarti.
          </Text>
          <Text style={styles.text}>
            Dovrai ora effettuare il normale accesso al registro elettronico:
            subito dopo, l'applicazione prenderà il controllo per eseguire
            la registrazione del tuo dispositivo.
          </Text>
          <Pressable
            style={styles.buttonContainer}
            onPress={() => setStage(1)}>
            <Text style={styles.buttonPrimary}>Associa il dispositivo</Text>
          </Pressable>
        </View>
      )}
      {stage == 1 && (
        <WebView
          source={{ uri: web + 'login/form/' }}
          onError={(event) => {
            setError('Errore di connessione\n' + event.nativeEvent.description);
            setStage(9);
          }}
          onHttpError={(event) => {
            setError('Errore di connessione\n' + event.nativeEvent.description);
            setStage(9);
          }}
          onNavigationStateChange={navigationChanged}
          startInLoadingState={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          UserAgent={'Mozilla/5.0 (Android 10; Mobile; rv:132.0) Gecko/132.0 Firefox/132.0 ' + Constants.expoConfig.extra.version}
          renderLoading={() => <Waiting />}
          ref={webViewRef}
        />
      )}





      {stage == 2 && (
        <View onLayout={connect}>
          <Text>In corso....</Text>
        </View>
      )}
      {stage == 3 && (
        <View>
          <Text>OK - Fine</Text>
        </View>
      )}
      {stage == 9 && (
        <View>
          <Text>ERRORE - Fine</Text>
          <Text>{error}</Text>
        </View>
      )}
    </View>
  );
};
