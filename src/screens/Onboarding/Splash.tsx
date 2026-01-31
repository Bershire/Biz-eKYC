import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FONT_FAMILIES } from 'src/assets/fonts';
import AppText from 'src/components/AppText/AppText';
import AppTouchableOpacity from 'src/components/AppTouchableOpacity/AppTouchableOpacity';
import AppView from 'src/components/AppView/AppView';
import Icon, { IconProps } from 'src/components/Icon/Icon';
import { AuthenticationParamList } from 'src/navigation/Authentication';
import { setHasLaunched } from 'src/store/appMeta';
import { useAppDispatch } from 'src/utils/useAppStore';

const OnboardingScreen = () => {
  const { t } = useTranslation('common');
  const navigation = useNavigation<NativeStackNavigationProp<AuthenticationParamList>>();
  const dispatch = useAppDispatch();
  const [activeIndex, setActiveIndex] = useState(0);

  type Slide = {
    key: string;
    title: string;
    description: string;
    iconType: IconProps['type'];
  };

  const slides: Slide[] = useMemo(
    () => [
      {
        key: 'first',
        title: t('onboarding.slides.first.title'),
        description: t('onboarding.slides.first.description'),
        iconType: 'nextFirst',
      },
      {
        key: 'second',
        title: t('onboarding.slides.second.title'),
        description: t('onboarding.slides.second.description'),
        iconType: 'nextSecond',
      },
      {
        key: 'third',
        title: t('onboarding.slides.third.title'),
        description: t('onboarding.slides.third.description'),
        iconType: 'nextThird',
      },
    ],
    [t],
  );

  const currentSlide = slides[activeIndex] ?? slides[0];
  const canExitOnBack = navigation.canGoBack();
  const isBackDisabled = activeIndex === 0 && !canExitOnBack;

  const handleNext = () => {
    if (activeIndex === slides.length - 1) {
      dispatch(setHasLaunched(true));
      navigation.replace('Login');
      return;
    }
    setActiveIndex(prev => Math.min(prev + 1, slides.length - 1));
  };

  const handleBack = () => {
    if (activeIndex === 0) {
      if (canExitOnBack) {
        navigation.goBack();
      }
      return;
    }
    setActiveIndex(prev => Math.max(prev - 1, 0));
  };

  if (!currentSlide) {
    return null;
  }

  return (
    <AppView
      flex={1}
      backgroundColor='background'
      paddingHorizontal='lg'
      paddingTop='3xl'
      paddingBottom='xl'
    >
      <AppView flex={1} alignItems='center'>
        <AppView marginTop='3xl' marginBottom='2xl'>
          <Icon type={currentSlide.iconType} width={200} height={200} />
        </AppView>
        <AppText
          fontSize={24}
          lineHeight={33}
          fontWeight='700'
          fontFamily={FONT_FAMILIES.nunitoSans}
          color='brightBlue'
          textAlign='center'
          marginBottom='lg'
        >
          {currentSlide.title}
        </AppText>
        <AppText
          fontSize={16}
          lineHeight={20}
          fontFamily={FONT_FAMILIES.nunitoSansRegular}
          color='nearBlack'
          fontWeight='500'
          textAlign='center'
          paddingHorizontal='2xs'
          marginLeft='lg'
          marginRight='lg'
        >
          {currentSlide.description}
        </AppText>
      </AppView>
      <AppView flexDirection='row' justifyContent='center' marginBottom='lg'>
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <AppView
              key={slide.key}
              width={8}
              height={8}
              borderRadius='md'
              backgroundColor={isActive ? 'deepBlue' : 'secondary'}
              marginRight={index < slides.length - 1 ? 'xs' : 'none'}
              marginBottom='md'
            />
          );
        })}
      </AppView>
      <AppView flexDirection='row' justifyContent='space-between'>
        <AppTouchableOpacity
          onPress={handleBack}
          disabled={isBackDisabled}
          flex={1}
          height={54}
          borderRadius='lg'
          borderWidth={1.5}
          borderColor={isBackDisabled ? 'text100' : 'deepBlue'}
          alignItems='center'
          justifyContent='center'
          marginRight='md'
        >
          <AppText
            fontSize={16}
            fontWeight='700'
            fontFamily={FONT_FAMILIES.nunitoSansRegular}
            color={isBackDisabled ? 'text300' : 'brightBlue'}
          >
            {t('onboarding.back')}
          </AppText>
        </AppTouchableOpacity>
        <AppTouchableOpacity
          onPress={handleNext}
          flex={1}
          height={54}
          borderRadius='lg'
          backgroundColor='deepBlue'
          alignItems='center'
          justifyContent='center'
          marginBottom='md'
        >
          <AppText
            fontSize={16}
            fontWeight='700'
            fontFamily={FONT_FAMILIES.nunitoSansBold}
            color='text000'
          >
            {activeIndex === slides.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
          </AppText>
        </AppTouchableOpacity>
      </AppView>
    </AppView>
  );
};

export default OnboardingScreen;
