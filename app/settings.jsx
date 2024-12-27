import { useState, useEffect } from 'react';
import { Text, View, TextInput, ScrollView } from 'react-native';
// import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import Pressable from '../components/PressableComponent';
import { styles } from './_layout';
import * as SecureStore from 'expo-secure-store';
import Checkbox from 'expo-checkbox';
import { Link, Stack , useRouter} from "expo-router";
import * as LocalAuthentication from 'expo-local-authentication';


// memorizza impostazioni
export default function SettingsScreen() {

  // inizializzazione
  const [web, setWeb] = useState(Constants.expoConfig.extra.url ?? 'https://');
  const [authentication, setAuthentication] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const router = useRouter();

  // controlla e salva le impostazioni
  const submit = () => {
    // controlli
    let msg = encodeURIComponent('I dati sono stati salvati senza errori.');

    if (web == '' || web == null) {
      msg = encodeURIComponent('Non hai indicato l\'indirizzo web del registro elettronico');
      router.push('/modal-error?msg=' + msg);
    } else if (!web.startsWith('http://') && !web.startsWith('https://')) {
      msg = encodeURIComponent('L\'indirizzo web del registro elettronico non è valido');
      router.push('/modal-error?msg=' + msg);
    } else {
      if (!web.endsWith('/')) {
        setWeb(web + '/');
      }

      let state = {
        web: web,
        authentication: authentication,
      };
      SecureStore.setItem("userData", JSON.stringify(state));
      msg = encodeURIComponent('OK');
      router.push('/modal-success?msg=' + msg);


    }

  };


  // legge dati dalla memoria permanente (eseguito solo al primo render)
  useEffect(() => {
    let result = SecureStore.getItem("userData");
    if (result) {
      let state = JSON.parse(result);
      setWeb(state.web);
      setAuthentication(state.authentication);
    }

    LocalAuthentication.supportedAuthenticationTypesAsync().then((types) => {
      console.warn("tipi: ", types);
      if (types && types.length > 0) {
        setBiometrics(true);
      }
    });

  }, []);


  // mostra pagina
  return (
    <>
      <Text style={styles.title}>Impostazioni generali</Text>


      <View>
        <Text style={styles.label}>Indirizzo web del Registro Elettronico:</Text>
        <TextInput
          style={styles.input}
          readOnly={ Constants.expoConfig.extra.url != '' }
          onChangeText={(val) => setWeb(val.replace(/\s/g, ''))}
          value={web}
        />
      </View>


      <Pressable onPress={() => setAuthentication(!authentication)}
          disabled={ !biometrics}>
        <View style={styles.checkboxContainer}>
          <Checkbox style={styles.checkbox}
            value={authentication}
            disabled={ !biometrics}
          />
          <Text style={styles.label}>Richiede l'autenticazione biometrica del dispositivo prima dell'accesso al Registro Elettronico</Text>
        </View>
      </Pressable>

      <View style={styles.buttonContainer}>
        <Pressable onPress={ submit }>
          <Text style={styles.buttonPrimary}>SALVA</Text>
        </Pressable>
        <Pressable onPress={ () => router.push('/') }>
          <Text style={styles.buttonSecondary}>ANNULLA</Text>
        </Pressable>
      </View>

</>
  );
}
