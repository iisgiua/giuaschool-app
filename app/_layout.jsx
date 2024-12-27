import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';


// imposta pagina iniziale
export const unstable_settings = {
  initialRouteName: 'index',
};

// impostazioni perla visualizzazione su tutte le pagine
export default function Layout() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#000000" />
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
        <Stack.Screen name="index" />
        {/* <Stack.Screen
          name="modal"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            headerShown: false,
          }}
        /> */}
      </Stack>
    </SafeAreaView>
  );
}

// definizione degli stili utilizzati
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#eeeeee',
  },

  link: {
    fontSize: 18,
    color: "#007BFF",
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 2,
  },
  labelDisabled: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 2,
    color: '#aaaaaa',
  },
  picker: {
    paddingVertical: 0,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
  },
  pickerItem: {
    fontSize: 16,
    color: '#000099',
  },
  input: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    color: '#000099',
  },
  passwordContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    paddingRight: 5,
    paddingLeft: 10,
  },
  password: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    color: '#000099',
  },
  icon: {
    backgroundColor: '#ffffff',
    color: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 20,
  },
  buttonContainer: {
    elevation: 8,
    marginVertical: 30,
    marginHorizontal: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonPrimary: {
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#000000',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#0066cc',
    color: '#ffffff',
  },
  buttonSecondary: {
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#000000',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#5c6f82',
    color: '#ffffff',
  },
  buttonDisabled: {
    fontSize: 18,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#000000',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#cccccc',
    color: '#666666',
  },
  spacedContainer: {
    flex: 1,
    marginVertical: 30,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#000000',
    padding: 10,
    marginVertical: 50,
    marginHorizontal: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    padding: 8,
    margin: 10,
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
