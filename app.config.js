const appName = "giua@school/app";
const appVersion = "3.2.1";

// vero solo quando la build usa il profilo CUSTOM di eas.json
const isCustom = !!process.env.URL;


export default {
  "expo": {
    "name": appName,
    "version": appVersion,
    "slug": "giuaschool-app",
    "description": "Web app per il registro scolastico giua@school",
    "githubUrl": "https://github.com/iisgiua/giuaschool-app",
    "owner": "iisgiua",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "scheme": "giuaschool",
    "ios": {
      "bundleIdentifier": "it.iisgiua.giuaschoolapp",
      "supportsTablet": true,
    },
    "android": {
      "package": "it.iisgiua.giuaschoolapp",
      "adaptiveIcon": {
      },
      "permissions": [
        "android.permission.INTERNET"
      ],
      "intentFilters": (isCustom ? [
        {
          "action": "VIEW",
          "autoVerify": true,
          "category": [
            "BROWSABLE",
            "DEFAULT"
          ],
          "data": [
            {
              "scheme": "https",
              "host": "registro.giua.edu.it",
              "pathPrefix": "/api/auth/request"
            }
          ]
        }
      ] : []),
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-asset",
      "expo-secure-store",
      "expo-font",
      "expo-status-bar",
      [
        "react-native-easy-biometrics",
        {
          "faceIDPermission": "Consenti di usare il riconoscimento del volto per l'accesso sicuro"
        }
      ],
      [
        "expo-screen-orientation",
        {
          "initialOrientation": "DEFAULT"
        }
      ],
      [
        "expo-splash-screen",
        {
          "image": "./assets/splash.png",
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 24
          }
        }
      ],
      [
        "expo-navigation-bar",
        {
          "enforceContrast": false,
          "style": "dark",
          "hidden": false
        }
      ],
    ],
    "extra": {
      "version": `${appName} ${appVersion}`,
      "url": process.env.URL ?? "",
      "school": process.env.SCHOOL ?? "",
      "eas": {
        "projectId": "9ff70fa2-33c4-41ae-886b-b648a786f5f9"
      }
    }
  }
};
