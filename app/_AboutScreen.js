// import React from 'react';
// import { Text, ScrollView, StyleSheet } from 'react-native';
// import AccordList from './AccordListComponent';
// import Styles from './Styles';


// export default ({navigation}) => {

//   // testo da mostrare
//   const menu = [
//     {
//       'title': 'Accesso con credenziali',
//       'text':
//         'Usa questa modalità solo se accedi al registro tramite le credenziali fornite dalla scuola.\n\n'+
//         'Per prima cosa, assicurati di essere in possesso delle credenziali corrette, effettuando una prova di accesso direttamente sul sito del registro. '+
//         'Quindi premi il pulsante "CONFIGURA L\'UTENTE" per accedere alla pagina della configurazione.\n\n'+
//         'Nella pagina di configurazione, dovrai inserire:\n'+
//         ' - Tipo di accesso: scegli "Usa le credenziali del registro"\n'+
//         ' - Nome utente: imposta il nome dell\'utente\n'+
//         ' - Password utente: imposta la password dell\'utente\n\n'+
//         'Al termine dell\'inserimento premi il pulsante "SALVA".\n'
//     },
//     {
//       'title': 'Accesso con GOOGLE',
//       'text':
//         'Usa questa modalità solo se accedi al registro tramite GOOGLE.\n\n'+
//         'Per prima cosa, assicurati di essere in possesso di utente e password corretti, effettuando una prova di accesso direttamente sul sito del registro. '+
//         'Quindi premi il pulsante "CONFIGURA L\'UTENTE" per accedere alla pagina della configurazione.\n\n'+
//         'Nella pagina di configurazione, dovrai inserire:\n'+
//         ' - Tipo di accesso: scegli "Usa GOOGLE"\n'+
//         ' - Nome utente: imposta il nome o l\'email dell\'utente GOOGLE\n'+
//         ' - Password utente: imposta la password dell\'utente GOOGLE\n\n'+
//         'Al termine dell\'inserimento premi il pulsante "SALVA".\n'
//     },
//     {
//       'title': 'Accesso con SPID',
//       'text':
//         'Usa questa modalità solo se accedi al registro tramite SPID.\n\n'+
//         'Tieni presente che per accedere al registro è sufficiente il LIVELLO 1 dello SPID: questo significa che basta inserire il nome utente e la password che ti sono stati forniti dal tuo gestore.\n\n'+
//         'Per prima cosa, assicurati di essere in possesso di utente e password corretti, effettuando una prova di accesso direttamente sul sito del registro, utilizzando la modalità SPID di LIVELLO 1; non usare quindi l\'app del gestore, né l\'accesso tramite SMS o altro tipo di notifica del codice OTP.\n\n'+
//         'Quindi premi il pulsante "CONFIGURA L\'UTENTE" per accedere alla pagina della configurazione.\n\n'+
//         'Nella pagina di configurazione, dovrai inserire:\n'+
//         ' - Tipo di accesso: scegli "Usa SPID"\n'+
//         ' - Gestore SPID: scegli il tuo gestore dall\'elenco proposto\n'+
//         ' - Nome utente: imposta il nome o l\'email dell\'utente SPID\n'+
//         ' - Password utente: imposta la password dell\'utente SPID\n\n'+
//         'Al termine dell\'inserimento premi il pulsante "SALVA".\n'
//     },
//     {
//       'title': 'Indirizzo del sito del registro',
//       'text':
//         'La possibilità di configurare l\'indirizzo del sito del registro è presente solo nella versione non personalizzata dell\'app.\n\n'+
//         'Premi il pulsante "CONFIGURA L\'UTENTE" per accedere alla pagina della configurazione.\n\n'+
//         'L\'ultimo campo mostrato nella pagina è quello indicato come "Indirizzo del sito del registro elettronico".\n\n'+
//         'Fai attenzione a inserire l\'indirizzo completo, altrimenti non sarà possibile accedere al registro elettronico.\n\n'+
//         'Al termine dell\'inserimento premi il pulsante "SALVA".\n'
//     },
//     {
//       'title': 'Impostazioni generali',
//       'text':
//         'E\' possibile modificare il comportamento dell\'app attraverso l\'impostazione di alcuni parametri.\n\n'+
//         'Premi il pulsante "IMPOSTAZIONI" per accedere alla pagina delle impostazioni dell\'app.\n\n'+
//         'L\'impostazione "Nasconde lo schermo durante il login" è inizialmente attiva, per impedire la visualizzazione dei diversi passaggi necessari per collegarsi al registro elettronico.\n'+
//         'Nel caso ci siano problemi nella connessione al registro, può essere opportuno disabilitare l\'impostazione per visualizzare gli errori mostrati durante la procedura.\n\n'+
//         'Al termine dell\'inserimento premi il pulsante "SALVA".\n'
//     },
//   ];

//   // mostra pagina
//   return (
//     <ScrollView>
//       <Text style={[Styles.title, {paddingTop: 10, paddingBottom: 20}]}>Uso dell'applicazione</Text>
//       <AccordList list={menu} />
//     </ScrollView>
//   );
// };
