import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';


// imposta pagina iniziale
export const unstable_settings = {
  initialRouteName: 'index',
};

// impostazioni di visualizzazione su tutte le pagine
export default function Layout() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light' backgroundColor='#000000' />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#5c6f82',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name='index' />
        <Stack.Screen
          name='modal'
          options={{
            presentation: 'transparentModal',
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}

// definizione degli stili
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: '#eeeeee',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    marginVertical: 50,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    elevation: 5, // solo Android
    shadowColor: '#000000', // solo IOS
    shadowOffset: { width: 0, height: 5 }, // solo IOS
    shadowOpacity: 0.25, // solo IOS
    shadowRadius: 5, // solo IOS
  },
  modalTitle: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTitleError: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#990000',
  },
  modalTitleSuccess: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#009900',
  },
  modalMessage: {
    marginBottom: 30,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 2,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  inputField: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    color: '#000099',
  },
  inputFieldDisabled: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    color: '#aaaaaa',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    margin: 10,
  },
  buttonGroup: {
    marginVertical: 30,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonPrimary: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#0066cc',
    color: '#ffffff',
  },
  buttonSecondary: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#5c6f82',
    color: '#ffffff',
  },

//----


  link: {
    fontSize: 18,
    color: '#007BFF',
    marginVertical: 10,
  },

  text:{
    fontSize: 16,
    color: '#000000',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#dddddd',
  },

  logoContainer: {
    alignItems: 'center',
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#000099',
  },
  schoolLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000099',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 10,
  },
  labelDisabled: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 2,
    color: '#aaaaaa',
  },


  icon: {
    backgroundColor: '#ffffff',
    color: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 20,
  },

  spacedContainer: {
    flex: 1,
    marginVertical: 30,
    marginHorizontal: 10,
    alignItems: 'center',
  },

  hidden: {
    margin: 0,
    width: 1,
  },
  accordRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems:'center',
  },
  accordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
  accordIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
  accordHr:{
    height: 2,
    width: '100%'
  },
  accordText:{
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#dddddd',
  },
  accordContent: {
    fontSize: 16,
    color: '#000',
  },
});
