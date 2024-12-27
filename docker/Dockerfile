### installa ambiente Debian 12 con nodeJS 22 (LTS)
FROM node:22

### installa ambiente di sviluppo
RUN npm install -g npm@latest expo-cli@latest eas-cli@latest

### copia l'applicazione
RUN mkdir /opt/giuaschool-app
WORKDIR /opt/giuaschool-app
COPY . .

# installa le dipendenze
RUN npm install

### porta del server di sviluppo
EXPOSE 8081

### comando predefinito per avviare il server di sviluppo
# CMD npm start --clear-cache
