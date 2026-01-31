import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, ScrollView, useWindowDimensions } from 'react-native';
import { FONT_FAMILIES } from 'src/assets/fonts';
import { IMAGES } from 'src/assets/images';
import logoBiz from 'src/assets/images/bootsplash/bootsplash_logo.png';
import { AppImageBackground } from 'src/components/AppImage/AppImage';
import AppText from 'src/components/AppText/AppText';
import AppTextInput from 'src/components/AppTextInput/AppTextInput';
import AppTouchableOpacity from 'src/components/AppTouchableOpacity/AppTouchableOpacity';
import AppView from 'src/components/AppView/AppView';
import Icon from 'src/components/Icon/Icon';
import { AuthenticationParamList } from 'src/navigation/Authentication';
import { updateAuthState } from 'src/store/auth';
import { useAppDispatch } from 'src/utils/useAppStore';

const SignUpScreen = () => {
  const { t } = useTranslation('common');
  const navigation = useNavigation<NativeStackNavigationProp<AuthenticationParamList>>();
  const dispatch = useAppDispatch();
  const { height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.max(320, Math.floor(screenHeight * 0.468));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectSeconds, setRedirectSeconds] = useState(3);

  const isPasswordMismatch = !!confirmPassword && password !== confirmPassword;
  const signUpDisabled =
    !email.trim() || !password || !confirmPassword || isPasswordMismatch || showSuccess;

  const socialButtons = useMemo(
    () => [
      {
        key: 'google',
        label: t('authentication.continueWithGoogle'),
        icon: 'googleIcon' as const,
      },
      {
        key: 'facebook',
        label: t('authentication.continueWithFacebook'),
        icon: 'facebookIcon' as const,
      },
      {
        key: 'apple',
        label: t('authentication.continueWithApple'),
        icon: 'appleIcon' as const,
      },
    ],
    [t],
  );

  const submitSignUp = () => {
    if (signUpDisabled) return;
    setShowSuccess(true);
  };

  useEffect(() => {
    if (!showSuccess) return;
    setRedirectSeconds(3);
    const endAt = Date.now() + 3000;
    const intervalId = setInterval(() => {
      const remainingMs = Math.max(0, endAt - Date.now());
      setRedirectSeconds(Math.max(0, Math.ceil(remainingMs / 1000)));
    }, 250);
    const timeoutId = setTimeout(() => {
      dispatch(updateAuthState({ token: 'local-token', refreshToken: 'local-refresh' }));
    }, 3000);
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [dispatch, showSuccess]);

  const progress = (3 - redirectSeconds) / 3;

  return (
    <AppView flex={1} backgroundColor='background'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <AppImageBackground
          source={IMAGES.loginBackground}
          resizeMode='cover'
          backgroundColor='deepBlue'
          height={heroHeight}
          paddingHorizontal='lg'
          paddingTop='2xl'
          paddingBottom='3xl'
          justifyContent='flex-start'
        >
          <AppView alignItems='center'>
            <AppView
              width={72}
              height={72}
              borderRadius='lg'
              backgroundColor='background'
              alignItems='center'
              justifyContent='center'
              marginBottom='md'
              shadowColor='shadow'
              shadowOpacity={0.12}
              shadowRadius={10}
              shadowOffset={{ width: 0, height: 6 }}
              elevation={6}
            >
              <Image source={logoBiz} style={{ width: 40, height: 40 }} resizeMode='contain' />
            </AppView>
            <AppText
              fontSize={24}
              lineHeight={36}
              fontWeight='700'
              fontFamily={FONT_FAMILIES.nunitoSans}
              color='text000'
              textAlign='center'
              marginTop='4xs'
              marginBottom='md'
            >
              {t('authentication.createAccountTitle')}
            </AppText>
          </AppView>
        </AppImageBackground>

        <AppView
          flex={1}
          paddingHorizontal='lg'
          paddingTop='sm'
          paddingBottom='xl'
          marginTop='-5xl'
          marginBottom='2xl'
        >
          <AppView
            backgroundColor='background'
            borderRadius='xl'
            padding='lg'
            shadowColor='text100'
            shadowOpacity={0.12}
            shadowRadius={14}
            shadowOffset={{ width: 0, height: 10 }}
            elevation={8}
          >
            <AppTextInput
              isEmail
              placeholder={t('authentication.emailPlaceholder')}
              value={email}
              onChange={setEmail}
              height={46}
              marginBottom='md'
              textInputProps={{
                fontSize: 16,
                fontFamily: FONT_FAMILIES.nunitoSansRegular,
                color: 'shadow',
              }}
            />
            <AppTextInput
              isPassword
              placeholder={t('authentication.passwordPlaceholder')}
              height={46}
              value={password}
              onChange={setPassword}
              marginBottom='md'
              textInputProps={{
                fontSize: 16,
                fontFamily: FONT_FAMILIES.nunitoSansRegular,
                color: 'shadow',
              }}
            />
            <AppTextInput
              isPassword
              placeholder={t('authentication.confirmPasswordPlaceholder')}
              height={46}
              value={confirmPassword}
              onChange={setConfirmPassword}
              marginBottom='md'
              textInputProps={{
                fontSize: 16,
                fontFamily: FONT_FAMILIES.nunitoSansRegular,
                color: 'shadow',
              }}
            />
            {isPasswordMismatch && (
              <AppText
                fontSize={12}
                lineHeight={16}
                fontFamily={FONT_FAMILIES.nunitoSansRegular}
                color='danger'
                marginBottom='md'
              >
                {t('authentication.passwordMismatch')}
              </AppText>
            )}

            <AppView flexDirection='row' alignItems='center' justifyContent='space-between'>
              <AppTouchableOpacity
                onPress={() => setRememberMe(prev => !prev)}
                flexDirection='row'
                alignItems='center'
              >
                <Icon
                  type={rememberMe ? 'checkboxChecked' : 'checkboxUnchecked'}
                  width={16}
                  height={16}
                  color={rememberMe ? 'primary' : 'text300'}
                />
                <AppText
                  marginLeft='xs'
                  fontSize={14}
                  lineHeight={19}
                  fontFamily={FONT_FAMILIES.nunitoSansRegular}
                  color='text400'
                >
                  {t('authentication.rememberMe')}
                </AppText>
              </AppTouchableOpacity>
              <AppTouchableOpacity onPress={() => null}>
                <AppText
                  fontSize={14}
                  lineHeight={19}
                  fontFamily={FONT_FAMILIES.nunitoSansRegular}
                  color='cornflowerBlue'
                >
                  {t('authentication.forgotPassword')}
                </AppText>
              </AppTouchableOpacity>
            </AppView>

            <AppTouchableOpacity
              onPress={submitSignUp}
              disabled={signUpDisabled}
              height={48}
              borderRadius='lg'
              backgroundColor='deepBlue'
              alignItems='center'
              justifyContent='center'
              marginTop='lg'
              marginBottom='lg'
            >
              <AppText
                fontSize={16}
                lineHeight={22}
                fontWeight='700'
                fontFamily={FONT_FAMILIES.nunitoSans}
                color='text000'
              >
                {t('authentication.signUp')}
              </AppText>
            </AppTouchableOpacity>

            <AppView
              flexDirection='row'
              alignItems='center'
              justifyContent='center'
              marginBottom='lg'
            >
              <AppView flex={1} height={1} backgroundColor='text050' />
              <AppText
                marginHorizontal='sm'
                fontSize={14}
                lineHeight={19}
                fontFamily={FONT_FAMILIES.nunitoSansRegular}
                color='text300'
              >
                {t('authentication.or')}
              </AppText>
              <AppView flex={1} height={1} backgroundColor='text050' />
            </AppView>

            {socialButtons.map((button, index) => (
              <AppTouchableOpacity
                key={button.key}
                onPress={() => null}
                height={48}
                borderRadius='lg'
                borderWidth={1}
                borderColor='text050'
                flexDirection='row'
                alignItems='center'
                justifyContent='center'
                marginBottom={index < socialButtons.length - 1 ? 'sm' : 'none'}
              >
                <Icon type={button.icon} width={18} height={18} marginRight='sm' />
                <AppText
                  fontSize={16}
                  lineHeight={18}
                  fontFamily={FONT_FAMILIES.nunitoSansRegular}
                  color='shadow'
                >
                  {button.label}
                </AppText>
              </AppTouchableOpacity>
            ))}

            <AppView flexDirection='row' alignItems='center' justifyContent='center' marginTop='lg'>
              <AppText
                fontSize={14}
                lineHeight={19}
                fontFamily={FONT_FAMILIES.nunitoSansRegular}
                color='text300'
              >
                {t('authentication.alreadyHaveAccount')}
              </AppText>
              <AppTouchableOpacity onPress={() => navigation.replace('Login')}>
                <AppText
                  marginLeft='xs'
                  fontSize={14}
                  lineHeight={19}
                  fontFamily={FONT_FAMILIES.nunitoSansRegular}
                  fontWeight='700'
                  color='brightBlue'
                >
                  {t('authentication.loginNow')}
                </AppText>
              </AppTouchableOpacity>
            </AppView>
          </AppView>
        </AppView>
      </ScrollView>
      <Modal animationType='fade' transparent visible={showSuccess} onRequestClose={() => null}>
        <AppView
          flex={1}
          alignItems='center'
          justifyContent='center'
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          paddingHorizontal='md'
        >
          <AppView
            alignItems='center'
            backgroundColor='background'
            borderRadius='lg'
            padding='lg'
            shadowColor='shadow'
            shadowOpacity={0.15}
            shadowRadius={16}
            shadowOffset={{ width: 0, height: 8 }}
            elevation={8}
            style={{ width: '100%', height: 339 }}
          >
            <AppView alignItems='center' marginBottom='2xl'>
              <AppView
                width={90}
                height={90}
                borderRadius='round'
                alignItems='center'
                justifyContent='center'
                backgroundColor='deepBlue'
                marginBottom='lg'
              >
                <Icon
                  type='registerCheck'
                  width={42}
                  height={27}
                  color='text000'
                  borderWidth={8}
                  borderColor='text000'
                  style={{ transform: [{ scale: 1.3 }] }}
                />
              </AppView>
              <AppText
                fontSize={24}
                lineHeight={24}
                height={33}
                fontWeight='700'
                fontFamily={FONT_FAMILIES.nunitoSansBold}
                color='brightBlue'
                textAlign='center'
                marginBottom='2xs'
              >
                {t('authentication.registrationSuccessful')}
              </AppText>
              <AppText
                fontSize={16}
                lineHeight={20}
                fontFamily={FONT_FAMILIES.nunitoSansRegular}
                color='backgroundContrast'
                textAlign='center'
              >
                {t('authentication.accountCreatedSuccessfully')}
              </AppText>
            </AppView>
            <AppView width='100%'>
              <AppText
                fontSize={16}
                lineHeight={16}
                fontFamily={FONT_FAMILIES.nunitoSansRegular}
                color='text100'
                textAlign='center'
                marginBottom='md'
              >
                {t('authentication.redirectingToHome', { seconds: redirectSeconds })}
              </AppText>
              <AppView width='100%' height={6} borderRadius='round' backgroundColor='text050'>
                <AppView
                  height={6}
                  borderRadius='round'
                  backgroundColor='deepBlue'
                  style={{ width: `${Math.min(1, Math.max(0, progress)) * 100}%` }}
                />
              </AppView>
            </AppView>
          </AppView>
        </AppView>
      </Modal>
    </AppView>
  );
};

export default SignUpScreen;
