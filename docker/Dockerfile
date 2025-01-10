### installa ambiene linux con Android 35 JDK 22 - NDK 27 - CMAKE 3.22
FROM saschpe/android-ndk:35-jdk22.0.2_9-ndk27.0.12077973-cmake3.22.1

### installa node 22 (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt install nodejs -y && \
  apt autoremove -y && \
  apt clean && \
  rm -rf /var/lib/apt/lists/*

### installa ambiente di sviluppo EXPO
RUN npm install -g npm@latest expo-cli@latest eas-cli@latest

### imposta directory di lavoro e copia i sorgenti
RUN mkdir /opt/giuaschool-app
WORKDIR /opt/giuaschool-app
COPY . .

### installa le dipendenze dell'applicazione
RUN npm install

### imposta variabili di ambiente
ENV ANDROID_NDK_HOME=$NDK_ROOT
ENV NODE_ENV=production

### porta del server di sviluppo
EXPOSE 8081

### comando predefinito
CMD ["/usr/bin/bash"]
