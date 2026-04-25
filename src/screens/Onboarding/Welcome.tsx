import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Defs, Line, Pattern, Rect } from 'react-native-svg';
import { FONT_FAMILIES } from 'src/assets/fonts';
import LOGO from 'src/assets/images/bootsplash/bootsplash_logo.png';
import { AuthenticationParamList } from 'src/navigation/Authentication';

const WELCOME_DURATION_MS = 1200;

const WelcomeScreen = () => {
  const { t } = useTranslation('common');
  const navigation = useNavigation<NativeStackNavigationProp<AuthenticationParamList>>();

  useEffect(() => {
    const timeout = setTimeout(() => navigation.replace('Onboarding'), WELCOME_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigation.replace('Onboarding')}
      style={styles.screen}
    >
      <StatusBar barStyle='light-content' backgroundColor={styles.screen.backgroundColor} />
      <Svg style={StyleSheet.absoluteFill} width='100%' height='100%'>
        <Defs>
          <Pattern id='grid' width='32' height='32' patternUnits='userSpaceOnUse'>
            <Line x1='32' y1='0' x2='32' y2='32' stroke='white' strokeOpacity='0.08' />
            <Line x1='0' y1='32' x2='32' y2='32' stroke='white' strokeOpacity='0.08' />
            <Circle cx='16' cy='16' r='1' fill='white' opacity='0.12' />
          </Pattern>
        </Defs>
        <Rect width='100%' height='100%' fill='url(#grid)' />
      </Svg>
      <View style={styles.content}>
        <View style={styles.logoCard}>
          <Image source={LOGO} resizeMode='contain' style={styles.logo} />
        </View>
        <Text style={styles.title}>{t('welcome.title')}</Text>
        <Text style={styles.subtitle}>{t('welcome.description')}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B7BEF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoCard: {
    width: 56,
    height: 56,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logo: {
    width: 44,
    height: 44,
  },
  title: {
    fontFamily: FONT_FAMILIES.nunitoSans,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subtitle: {
    maxWidth: 240,
    fontFamily: FONT_FAMILIES.nunitoSans,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
