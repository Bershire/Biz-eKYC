import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FONT_FAMILIES } from 'src/assets/fonts';
import { ICONS } from 'src/assets/icons';
import AppText from 'src/components/AppText/AppText';
import AppTouchableOpacity from 'src/components/AppTouchableOpacity/AppTouchableOpacity';
import AppView from 'src/components/AppView/AppView';
import { AuthenticationParamList } from 'src/navigation/Authentication';

const OnboardingScreen = () => {
  const { t } = useTranslation('common');
  const navigation = useNavigation<NativeStackNavigationProp<AuthenticationParamList>>();
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(
    () => [
      {
        key: 'first',
        title: t('onboarding.slides.first.title'),
        description: t('onboarding.slides.first.description'),
        Icon: ICONS.nF,
      },
      {
        key: 'second',
        title: t('onboarding.slides.second.title'),
        description: t('onboarding.slides.second.description'),
        Icon: ICONS.nS,
      },
      {
        key: 'third',
        title: t('onboarding.slides.third.title'),
        description: t('onboarding.slides.third.description'),
        Icon: ICONS.nT,
      },
    ],
    [t],
  );

  const currentSlide = slides[activeIndex] ?? slides[0];
  const canExitOnBack = navigation.canGoBack();
  const isBackDisabled = activeIndex === 0 && !canExitOnBack;

  const handleNext = () => {
    if (activeIndex === slides.length - 1) {
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

  const Icon = currentSlide.Icon;

  return (
    <AppView
      flex={1}
      backgroundColor='background'
      paddingHorizontal='lg'
      paddingTop='2xl'
      paddingBottom='xl'
    >
      <AppView flex={1} alignItems='center'>
        <AppView marginTop='sm' marginBottom='lg'>
          <Icon width={200} height={200} />
        </AppView>
        <AppText
          fontSize={22}
          lineHeight={26}
          fontWeight='700'
          fontFamily={FONT_FAMILIES.nunitoSans}
          color='primary'
          textAlign='center'
          marginBottom='sm'
        >
          {currentSlide.title}
        </AppText>
        <AppText
          fontSize={14}
          lineHeight={20}
          fontWeight='400'
          fontFamily={FONT_FAMILIES.nunitoSans}
          color='text500'
          textAlign='center'
          paddingHorizontal='2xs'
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
              backgroundColor={isActive ? 'primary' : 'secondary'}
              marginRight={index < slides.length - 1 ? 'xs' : 'none'}
            />
          );
        })}
      </AppView>
      <AppView flexDirection='row' justifyContent='space-between'>
        <AppTouchableOpacity
          onPress={handleBack}
          disabled={isBackDisabled}
          flex={1}
          height={48}
          borderRadius='lg'
          borderWidth={1.5}
          borderColor={isBackDisabled ? 'text100' : 'primary'}
          alignItems='center'
          justifyContent='center'
          marginRight='md'
        >
          <AppText
            fontSize={16}
            fontWeight='600'
            fontFamily={FONT_FAMILIES.nunitoSans}
            color={isBackDisabled ? 'text300' : 'primary'}
          >
            {t('onboarding.back')}
          </AppText>
        </AppTouchableOpacity>
        <AppTouchableOpacity
          onPress={handleNext}
          flex={1}
          height={48}
          borderRadius='lg'
          backgroundColor='primary'
          alignItems='center'
          justifyContent='center'
        >
          <AppText
            fontSize={16}
            fontWeight='600'
            fontFamily={FONT_FAMILIES.nunitoSans}
            color='text000'
          >
            {activeIndex === slides.length - 1
              ? t('onboarding.getStarted')
              : t('onboarding.next')}
          </AppText>
        </AppTouchableOpacity>
      </AppView>
    </AppView>
  );
};

export default OnboardingScreen;
