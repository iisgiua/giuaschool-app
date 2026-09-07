# ============================================================
# Ambiente di sviluppo React Native / Expo
#
# Target: Expo SDK 57 / React Native 0.86
# Compatibilità runtime garantita: Android 7.0+ (API 24)
# Node.js 22 (>= 22.13.x richiesto da Expo SDK 57)
# Android SDK 36 (compile/target) - JDK 17 - NDK 28c
# ============================================================

FROM ubuntu:24.04

ARG DEBIAN_FRONTEND=noninteractive

# ------------------------------------------------------------
# Versioni principali dell'ambiente
# ------------------------------------------------------------
ARG NODE_MAJOR=22
ARG ANDROID_API=36
ARG ANDROID_BUILD_TOOLS=36.0.0
ARG ANDROID_NDK_VERSION=28.2.13676358
ARG CMDLINE_TOOLS_VERSION=15859902

ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_NDK_HOME=${ANDROID_SDK_ROOT}/ndk/${ANDROID_NDK_VERSION}
ENV ANDROID_NDK_ROOT=${ANDROID_SDK_ROOT}/ndk/${ANDROID_NDK_VERSION}
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Cache Gradle in un percorso dedicato: se questa cartella viene montata
# come volume Docker, le build successive risparmiano tempo enorme
# perché non riscaricano le dipendenze ad ogni "docker run".
ENV GRADLE_USER_HOME=/opt/gradle-cache

ENV PATH="${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:${ANDROID_SDK_ROOT}/emulator:${ANDROID_NDK_HOME}:${JAVA_HOME}/bin:${PATH}"

# ------------------------------------------------------------
# Pacchetti di sistema
# ------------------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        unzip \
        zip \
        git \
        bash \
        wget \
        sudo \
        openjdk-17-jdk \
        python3 \
        make \
        g++ \
        libc6 \
        libstdc++6 \
        libgcc-s1 \
        lib32z1 \
        lib32stdc++6 \
    && rm -rf /var/lib/apt/lists/*

# ------------------------------------------------------------
# Node.js 22
# ------------------------------------------------------------
ARG NPM_VERSION=10.9.8

RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash - \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/* \
    # Pin esplicito della versione npm: indipendentemente da quale
    # versione arrivi bundlata con Node in questo momento, fissiamo
    # sempre la stessa, così l'immagine resta riproducibile bit per
    # bit nel tempo, e un aggiornamento di npm diventa una scelta
    # esplicita (cambiare questo ARG), non un effetto collaterale
    # di quando ricostruisci l'immagine.
    && npm install -g npm@${NPM_VERSION} \
    # Verifica che la versione installata soddisfi il minimo richiesto
    # da Expo SDK 57 (22.13.x). Se nodesource pubblica una minor più
    # vecchia, la build fallisce qui invece che silenziosamente più tardi.
    && node -e "const v=process.versions.node.split('.').map(Number); \
        if (v[0] < 22 || (v[0]===22 && v[1] < 13)) { \
            console.error('Node ' + process.versions.node + ' non soddisfa il minimo 22.13.x richiesto da Expo SDK 57'); \
            process.exit(1); \
        }"

# ------------------------------------------------------------
# Android Command Line Tools
# ------------------------------------------------------------
RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools \
    && curl -fsSL \
       https://dl.google.com/android/repository/commandlinetools-linux-${CMDLINE_TOOLS_VERSION}_latest.zip \
       -o /tmp/cmdline-tools.zip \
    && unzip -q /tmp/cmdline-tools.zip -d /tmp \
    && mv /tmp/cmdline-tools ${ANDROID_SDK_ROOT}/cmdline-tools/latest \
    && rm -f /tmp/cmdline-tools.zip

# ------------------------------------------------------------
# Android SDK
#
# NOTA: qui NON usiamo "|| true" sull'installazione dei pacchetti,
# solo sull'accettazione licenze. Un errore reale nel download degli
# SDK deve far fallire la build dell'immagine, non passare inosservato.
# ------------------------------------------------------------
RUN yes | sdkmanager --licenses >/dev/null || true \
    && sdkmanager \
        "platform-tools" \
        "platforms;android-${ANDROID_API}" \
        "build-tools;${ANDROID_BUILD_TOOLS}" \
        "ndk;${ANDROID_NDK_VERSION}" \
    && yes | sdkmanager --licenses >/dev/null || true

# ------------------------------------------------------------
# Expo CLI
#
# NON installiamo expo-cli globalmente: Expo viene usato tramite npx
# con la versione fissata nel package.json del progetto. Installiamo
# solo eas-cli, che serve per build/submit e non dipende dalla SDK
# del progetto specifico.
# ------------------------------------------------------------
RUN npm install -g eas-cli@latest

# ------------------------------------------------------------
# Utente non privilegiato
#
# Approccio conservativo: se l'immagine base ha già un utente/gruppo
# su quell'UID/GID (es. "ubuntu" su ubuntu:24.04+), lo riusiamo così
# com'è, SENZA rinominarlo né modificarlo in alcun modo. Creiamo un
# nuovo utente solo se quell'UID/GID risulta libero.
#
# In entrambi i casi, tutti i passaggi successivi (sudo, permessi,
# working directory) operano per UID/GID numerico, non per nome:
# così funzionano a prescindere da quale account risulti presente,
# senza bisogno di sapere o propagare il suo nome effettivo.
# ------------------------------------------------------------
ARG USER_UID=1000
ARG USER_GID=1000
ARG USER_NAME=developer
ARG GROUP_NAME=developer

RUN if getent passwd ${USER_UID} >/dev/null 2>&1; then \
        echo "UID ${USER_UID} già presente nell'immagine base: riuso l'utente esistente senza modifiche."; \
    else \
        if ! getent group ${USER_GID} >/dev/null 2>&1; then \
            groupadd -g ${USER_GID} ${GROUP_NAME}; \
        fi; \
        useradd -m -s /bin/bash -u ${USER_UID} -g ${USER_GID} ${USER_NAME}; \
        echo "Creato nuovo utente '${USER_NAME}' con UID ${USER_UID}."; \
    fi \
    # Permesso sudo assegnato per UID numerico ("#UID" nella sintassi
    # sudoers), non per nome: vale sia per l'utente preesistente
    # sia per quello appena creato, senza doverne conoscere il nome.
    && echo "#${USER_UID} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers \
    && mkdir -p ${GRADLE_USER_HOME} /opt/giuaschool-app/node_modules \
    # chown per UID:GID numerico, non per nome:utente: evita di dover
    # sapere quale nome sia risultato dal blocco condizionale sopra.
    && chown -R ${USER_UID}:${USER_GID} ${ANDROID_SDK_ROOT} ${GRADLE_USER_HOME} /opt/giuaschool-app

# USER per UID:GID numerico: identico sia che l'account risultante
# si chiami "ubuntu" (preesistente, riusato) sia "developer" (creato
# da noi in questa build). Docker supporta nativamente questa forma.
USER ${USER_UID}:${USER_GID}
WORKDIR /opt/giuaschool-app

# ------------------------------------------------------------
# Configurazione sviluppo
# ------------------------------------------------------------
ENV NODE_ENV=development

# Porta del Metro bundler (server di sviluppo Expo)
EXPOSE 8081

CMD ["/bin/bash"]
