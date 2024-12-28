import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Pressable from '../components/PressableComponent';
import { createDeviceId } from '../utils/DeviceInfo';
import { styles } from './_layout';


// associa dispositivo al registro
export default function ConnectScreen() {

  // inizializza
  const [web, setWeb] = useState('');
  const [device, setDevice] = useState('');
  const [stage, setStage] = useState(0);
  const webViewRef = useRef(null);




  // mostra icona di attesa
  const waitingComponent = () => {
    return (
      <ActivityIndicator
        color='#000099'
        size='large'
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
    );
  };

  // gestione cambio pagina
  const navigationChanged = (event) => {
    const url = event.url + (event.url.endsWith('/') ? '' : '/');
    console.warn('URL: ' + url + ' *** ' + web);

    if (url == web) {
      setStage(2);
    }

  };

  // connessione app
  const connect = async () => {
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
    let result = SecureStore.getItem('userData');
    if (result) {
      let state = JSON.parse(result);
      setWeb(state.web);
    }

    (async () => {
      const token = await createDeviceId();
      setDevice(token);
    })();

  }, []);


  // mostra pagina
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Associa il dispositivo',
        }}
      />
      {stage === 0 && (
        <View>
          <Text style={styles.text}>
            Questo dispositivo sarà associato al Registro Elettronico in modo che non sia più necessario
            usare le credenziali per collegarti.
          </Text>
          <Text style={styles.text}>
            Dovrai ora effettuare il normale accesso al Registro Elettronico e subito dopo l'applicazione
            prenderà il controllo per eseguire la registrazione del tuo dispositivo.
          </Text>
          <Pressable style={{ marginBottom: 20 }} onPress={() => setStage(1)}>
            <Text style={styles.buttonSecondary}>Associa il dispositivo</Text>
          </Pressable>
        </View>
      )}




      {stage === 1 && (
        // <View>
        <WebView
          source={{ uri: web+'login/form/' }}

          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn(
              'HTTP error status code: ',
              nativeEvent,
            );
          }}

          onNavigationStateChange={navigationChanged}
          // incognito = {true}

          renderLoading={waitingComponent}
          startInLoadingState={true}
          javaScriptEnabled={true}
          userAgent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246 giua@school/app 3.1'
          ref={webViewRef}
        />
        // </View>
      )}
      {stage === 2 && (
        <View onLayout={connect}>
          <Text>In corso....</Text>
        </View>
      )}
      {stage === 3 && (
        <View>
          <Text>OK - Fine</Text>
        </View>
      )}
      {stage === 4 && (
        <View>
          <Text>ERRORE - Fine</Text>
        </View>
      )}
    </View>
  );
};
