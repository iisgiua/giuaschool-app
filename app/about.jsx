import { Stack } from 'expo-router';
import { Link } from "expo-router";
import { View, Text } from "react-native";
import { styles } from "./_layout"; // Import degli stili condivisi
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';



export default function DetailsScreen() {

    const [web, setWeb] = useState('');
    const [authentication, setAuthentication] = useState(false);
    const [token, setToken] = useState('');

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
      <Stack.Screen
        options={{
          title: 'Questo è altro',
        }}
      />
      <Text style={styles.title}>Questa è la schermata dei Dettagli!</Text>
      <Link href="/" style={styles.link}>
        Torna alla Home
      </Link>
      <Text>url: {Constants.expoConfig.extra.url}</Text>
      <Text>scuola: {Constants.expoConfig.extra.school}</Text>
      <Text>version: {Constants.expoConfig.extra.version}</Text>

      <Text>web: {web}</Text>
      <Text>authentication: {authentication}</Text>
      <Text>token: {token}</Text>

    </View>
  );
}

// export const config = {
//   headerTitle: "Dettagli", // Titolo per questa schermata
// };
