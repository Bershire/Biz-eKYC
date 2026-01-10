import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../utils/useAppStore';
import { updateAuthState } from '../../store/auth';

const LoginScreen = () => {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  const submitLogin = () => {
    if (!email.trim() || !password) return;
    dispatch(updateAuthState({ token: 'local-token', refreshToken: 'local-refresh' }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('authentication.signIn')}</Text>
      <TextInput
        autoCapitalize='none'
        keyboardType='email-address'
        placeholder={t('authentication.email')}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        secureTextEntry
        placeholder={t('authentication.password')}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Pressable
        style={[styles.button, (!email.trim() || !password) && styles.buttonDisabled]}
        onPress={submitLogin}
        disabled={!email.trim() || !password}
      >
        <Text style={styles.buttonText}>{t('authentication.signIn')}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2b5cff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default LoginScreen;
