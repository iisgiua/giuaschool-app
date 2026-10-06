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
#       npx expo install
#
#   Controllo dipendenze (EXPO)
#       npx expo-doctor@latest
#
#   Compilazione Android
#       rm -rf android
#       npx expo prebuild --platform android --clean
#       cd android && ./gradlew assembleDebug
#       cd ..
#
#   Dal computer host, per associare la porta del debugger verso l'USB
#       adb reverse tcp:8081 tcp:8081
#
