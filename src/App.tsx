import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';
import { ThemeProvider } from '@shopify/restyle';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import Config from 'react-native-config';
import RNExitApp from 'react-native-exit-app';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './i18n/i18n';
import AppNavigator from './navigation/navigation';
import { useFirebaseMutation } from './services/auth';
import { setApiUrl } from './store/apiUrl';
import { selectToken } from './store/auth';
import { persistor, store } from './store/store';
import theme from './theme/theme';
import { scrubSentryEvent } from './utils/scrubber';
import { useAppDispatch, useAppSelector } from './utils/useAppStore';
import { validateEnvConfig } from './utils/validateEnvConfig';
import { z } from 'zod';

const navigationIntegration = Sentry.reactNavigationIntegration({});
const allSettled = Promise.allSettled;
Sentry.init({
  dsn:
    __DEV__ ? undefined : (
      'https://ff9c84f57c024c53d37702a197278255@o4509050107723776.ingest.us.sentry.io/4509060446879744'
    ),

  tracesSampleRate: 0.1,
  profilesSampleRate: 0.02,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,

  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.httpClientIntegration(),
    Sentry.reactNativeTracingIntegration(),
    Sentry.feedbackIntegration(),
    navigationIntegration,
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,

  beforeSend: scrubSentryEvent,
  beforeSendTransaction: scrubSentryEvent,
});
Promise.allSettled = allSettled.bind(Promise);
const Entrypoint = () => {
  const { t, i18n } = useTranslation();
  const [apiUrlGet, setApiUrlGet] = useState(false);
  const dispatch = useAppDispatch();
  const language = useAppSelector(s => s.settings.language);
  const hasLaunched = useAppSelector(s => s.appMeta.hasLaunched);
  const token = useAppSelector(selectToken);
  const [registerFirebaseToken] = useFirebaseMutation();
  const [hasRegisteredFirebaseToken, setHasRegisteredFirebaseToken] = useState(false);

  const getNotification = useCallback(async () => {
    try {
      const FCMToken = await messaging().getToken();
      console.log('FCM TOKEN', FCMToken);
      //migrate firebase token retrieval here
      if (FCMToken) {
        const res = await registerFirebaseToken({ token: FCMToken });
        console.log('RES', res);
        return true;
      }
    } catch (error) {
      console.log('ERROR RETRIEVING FCM', error);
    }
    return false;
  }, [registerFirebaseToken]);

  useEffect(() => {
    if (!token) {
      setHasRegisteredFirebaseToken(false);
    }
  }, [token]);
  useEffect(() => {
    if (apiUrlGet && token && !hasRegisteredFirebaseToken) {
      getNotification()
        .then(success => {
          if (success) {
            setHasRegisteredFirebaseToken(true);
          }
        })
        .catch(error => {
          console.log('ERROR', error);
        });
    }
  }, [apiUrlGet, token, hasRegisteredFirebaseToken, getNotification]);
  useEffect(() => {
    validateEnvConfig();
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  useEffect(() => {
    const getApiUrl = async () => {
      const res = await fetch(Config.BASE_API_URL);
      const apiUrl = await res.json();
      return z.string().url().parse(apiUrl);
    };

    getApiUrl()
      .then(apiUrl => {
        console.log('BASE URL', apiUrl);
        dispatch(setApiUrl(apiUrl));
        setApiUrlGet(true);
      })
      .catch(error => {
        console.log(error);
        Alert.alert(t('genericErrorMessage'), '', [
          { text: t('button.ok'), onPress: () => RNExitApp.exitApp() },
        ]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run this once
  }, []);

  return apiUrlGet && <AppNavigator onReady={navigationIntegration.registerNavigationContainer} />;
};


const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
            <SafeAreaProvider>
              <Entrypoint />
            </SafeAreaProvider>
          </KeyboardProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
