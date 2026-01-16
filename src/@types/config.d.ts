declare module 'react-native-config' {
  export interface NativeConfig {
    TYPE: 'UAT' | 'PROD';
    BASE_API_URL: string;
    WEB_CLIENT_ID: string;
    IOS_EKYC_APP_ID: string;
    IOS_EKYC_TOKEN: string;
    EKYC_URL: string;
  }
  export const Config: NativeConfig;
  export default Config;
}
