#!/bin/bash

# Se esiste un package.json ma node_modules è vuota (o assente),
# installa le dipendenze prima di consegnare il controllo alla shell.
# Questo copre il caso in cui il progetto sia montato come volume
# e quindi non presente al momento della build dell'immagine.
if [ -f package.json ] && [ ! -d node_modules/expo ]; then
    echo "Installazione dipendenze npm..."
    npm install
fi

exec "$@"

############################
# Comandi utili:
#
#   Aggiorna/installa (EXPO)
#       npx expo install --check
#
#   Constrollo vulnerbilità escluse quelle di sviluppo
#       npm audit --omit dev
#
#   Controllo dipendenze (EXPO)
#       npx expo-doctor@latest
#
#   Compilazione locale Android per debug
#       rm -rf android
#       npx expo prebuild --platform android --clean
#       cd android && ./gradlew assembleDebug
#       cd ..
#
#   Esecuzione build locale (via USB) o Expo Go
#       npx expo start
#
#   Dal computer host, per associare la porta del debugger verso l'USB
#       adb reverse tcp:8081 tcp:8081
#
#   Compilazione versione di produzione
#       eas build --platform androi --profile custom --local --output ./dist/giuaschool-app-CUSTOM-3.2.1.apk
#
