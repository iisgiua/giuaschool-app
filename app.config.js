const appName = "giua@school/app";
const appVersion = "3.1.3";

export default {
  "expo": {
    "name": appName,
    "version": appVersion,
    "slug": "giuaschool-app",
    "descrition": "Web app per il registro scolastico giua@school",
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
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
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
      ]
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
