const appName = "giua@school/app";
const appVersion = "3.1";

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
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "newArchEnabled": true,
    "scheme": "giuaschool",
    "ios": {
      "bundleIdentifier": "it.iisgiua.giuaschool-app",
      "supportsTablet": true,
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "Allow $(PRODUCT_NAME) to access your photos",
        "NSPhotoLibraryAddUsageDescription": "Allow $(PRODUCT_NAME) to save photos"
      }
    },
    "android": {
      "package": "it.iisgiua.giuaschool-app",
      "adaptiveIcon": {
      },
      "permissions": [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_MEDIA_LOCATION"
      ],
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-screen-orientation",
        {
          "initialOrientation": "DEFAULT"
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
