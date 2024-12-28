import { useState, useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { styles } from './_layout';
import * as SecureStore from 'expo-secure-store';
// import CookieManager from '@react-native-cookies/cookies';


export default function LoginScreen() {

  const [web, setWeb] = useState('');
  const [authentication, setAuthentication] = useState(false);
  const [token, setToken] = useState('');


  const _handlePressButtonAsync = async () => {
    const url = web + 'ajax/token/authenticate';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246 giua@school/app 3.1',
      },
    });
    if (!response.ok) {
      throw new Error(`Errore nella richiesta: ${response.status}`);
    }
    const data = await response.json();

    const url2 = web + 'login/form/';
    const encodedData = '_username=ministro&_password=12345678&_csrf_token='+data['authenticate'];
    const response2 = await fetch(url2, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246 giua@school/app 3.1',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodedData,
    });
    const result = await response2.text();
    console.warn('--> LOGIN ');

    const url3 = web + 'login/app/';
    const response3 = await fetch(url3, {
      method: 'POST',
      headers: {
        // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246 giua@school/app 3.1',
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:132.0) Gecko/132.0 Firefox/132.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({token: token})
    });
    const data3 = await response3.json();
    const sessionID = data3['session']
    console.warn('--> SESSIONID: ', sessionID);

    // // set a cookie
    // const done = await CookieManager.set(web, {
    //   name: 'PHPSESSID',
    //   value: sessionID,
    //   // domain: 'some domain',
    //   path: '/',
    //   version: '1',
    //   expires: '2025-05-30T12:30:00.00-05:00'
    // });
    // console.warn('--> done: ', done);

    // document.cookie = `SESSIONID=${sessionID}; path=/; secure`;
    await WebBrowser.openAuthSessionAsync(web);


  };

  // legge dati dalla memoria permanente (eseguito solo al primo render)
  useEffect(() => {
    let result = SecureStore.getItem("userData");
    if (result) {
      let state = JSON.parse(result);
      setWeb(state.web);
      setAuthentication(state.authentication);
    }
    result = SecureStore.getItem("token");
    if (result) {
      setToken(result);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Open WebBrowser" onPress={_handlePressButtonAsync} />
      <Text>web: {web}</Text>
      <Text>authentication: {authentication}</Text>
      <Text>token: {token}</Text>
    </View>
  );
}
