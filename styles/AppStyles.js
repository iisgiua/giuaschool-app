/*
 * SPDX-FileCopyrightText: 2022 I.I.S. Michele Giua - Cagliari - Assemini
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import { StyleSheet } from 'react-native';


// **
// * Definizione degli stili di uso generale
// *
// * @author Antonello Dessì
// *
export const styles = StyleSheet.create({
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
  buttonGroup: {
    marginVertical: 30,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    marginVertical: 30,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  buttonPrimary: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#0066cc',
    color: '#ffffff',
    elevation: 10,
  },
  buttonSecondary: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    color: '#0066cc',
    elevation: 10,
  },
  buttonWarning: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#992222',
    color: '#ffffff',
    elevation: 10,
  },
  title: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000099',
  },
  text: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  textSmall: {
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'left',
  },
  textSmallBold: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  activityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
  },
  logoContainer: {
    marginBottom: 30,
    padding: 10,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoSmallContainer: {
    marginBottom: 10,
    padding: 5,
    alignItems: 'center',
  },
  logoSmall: {
    width: 40,
    height: 40,
    marginRight: 10,
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
  spacedContainer: {
    marginVertical: 30,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  spaced: {
    marginBottom: 20,
  },
  url: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000099',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
});
