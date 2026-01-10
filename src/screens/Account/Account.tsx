import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../utils/useAppStore';
import { logout } from '../../store/auth';

const AccountScreen = () => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('screens.account')}</Text>
      <Pressable style={styles.button} onPress={() => dispatch(logout())}>
        <Text style={styles.buttonText}>{t('account.logout')}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#ff3b30',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AccountScreen;
