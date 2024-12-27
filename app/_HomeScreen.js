// import React from 'react';
// import { Image, Text, View, ScrollView } from 'react-native';
// import * as SecureStore from 'expo-secure-store';
// import Constants from 'expo-constants';
// import Pressable from '../components/PressableComponent';
// import Styles from './Styles';
// import logo from '../assets/logo.png';


// const Home = ({ navigation }) => {
//   // definizione dello stato
//   const [type, setType] = React.useState('');
//   const [manager, setManager] = React.useState('');
//   const [user, setUser] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const [webSite, setWebSite] = React.useState('');
//   const [hideScreen, setHideScreen] = React.useState(true);


//   // inizializza dati
//   React.useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       secureRead();
//     });
//     return unsubscribe;
//   }, [navigation]);

//   // mostra pagina
//   return (
//     <ScrollView style={Styles.container}>
//       <View style={Styles.logoContainer}>
//         <Image style={Styles.logo}
//           source={logo}
//         />
//         <Text style={Styles.logoLabel}>giua@school</Text>
//         { Constants.expoConfig.extra.school != '' &&
//           <Text style={Styles.schoolLabel}>{Constants.expoConfig.extra.school}</Text>
//         }
//       </View>
//       <View style={Styles.spacedContainer}>
//         {(type != '' && user != '' && password != '')
//           ?
//           <Pressable style={{marginBottom:20}} onPress={() => navigation.navigate('web')}>
//             <Text style={Styles.buttonPrimary}>Vai al registro</Text>
//           </Pressable>
//           :
//           <Text style={[{marginBottom:20},Styles.buttonDisabled]}>Vai al registro</Text>
//         }
//         <Pressable style={{marginBottom:20}} onPress={() => navigation.navigate('user')}>
//           <Text style={Styles.buttonSecondary}>Configura l'utente</Text>
//         </Pressable>
//         <Pressable style={{marginBottom:20}} onPress={() => navigation.navigate('settings')}>
//           <Text style={Styles.buttonSecondary}>Impostazioni</Text>
//         </Pressable>
//         <Pressable style={{marginBottom:20}} onPress={() => navigation.navigate('about')}>
//           <Text style={Styles.buttonSecondary}>Informazioni</Text>
//         </Pressable>
//       </View>
//     </ScrollView>
//   );
// };

// export default Home;
