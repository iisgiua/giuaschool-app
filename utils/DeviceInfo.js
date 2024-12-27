import * as Device from 'expo-device';
import * as Crypto  from 'expo-crypto';


// genera un ID univoco per il dispositivo
export async function createDeviceId() {
  let info =
    Device.brand + '/' +
    Device.modelName + '/' +
    Device.deviceType + '/' +
    Device.deviceYearClass + '/' +
    Device.osName + '/' +
    Device.osVersion + '/' +
    Device.osBuildId + '/' +
    Device.osInternalBuildId;
  let token = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, info);
  return token;
}
