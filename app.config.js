export default {
  "expo": {
    "name": "giua@school/app",
    "descrition": "Web app per il registro scolastico giua@school",
    "slug": "giuaschool-app",
    "version": "3.1",
    "githubUrl": "https://github.com/iisgiua/giuaschool-app",
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
      "version": "giua@school/app 3.1",
      "url": process.env.URL ?? "",
      "school": process.env.SCHOOL ?? "",
      "eas": {
        "projectId": "a28e51a5-5f05-4cd7-b81f-beef2ac255d5"
      }
    }
  }
};
