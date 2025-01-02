// import { saveUserData, readUserData } from "../utils/StorageManager";
// import {useState} from "react";

import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { styles } from "./_layout";


export default function HomeScreen() {

  // const [web, setWeb] = useState("");
  // const [authentication, setAuthentication] = useState(false);
  // const [token, setToken] = useState("");

  // saveUserData("http:/prova", true);
  // readUserData(setWeb, setAuthentication);
  // console.warn('web: ', web);
  // console.warn('authentication: ', authentication);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My home',
        }}
      />
      <Text style={styles.title}>
        Se non c'è token, vai all'associazione.
        Altrimenti login
      </Text>
      <Link href="/connect" style={styles.link}>
        Associa il tuo dispositivo al registro
      </Link>
      <Link href="/login" style={styles.link}>
        Login
      </Link>
      <Link href="/settings" style={styles.link}>
        Impostazioni
      </Link>
      <Link href="/about" style={styles.link}>
        Info About
      </Link>

      <Link href="https://registro.giua.edu.it" style={styles.link}>
        Registro
      </Link>

      <Text>  </Text>
    </View>
  );
}
