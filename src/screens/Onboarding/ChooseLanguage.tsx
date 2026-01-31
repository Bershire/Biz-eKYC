import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppText from 'src/components/AppText/AppText';
import AppTouchableOpacity from 'src/components/AppTouchableOpacity/AppTouchableOpacity';
import AppView from 'src/components/AppView/AppView';
import Icon, { IconProps } from 'src/components/Icon/Icon';
import { setLanguageSetting } from 'src/store/settings';
import { useAppDispatch } from 'src/utils/useAppStore';
import { FONT_FAMILIES } from '../../assets/fonts';
import i18n from '../../i18n/i18n';
import { AuthenticationParamList } from '../../navigation/Authentication';
type LanguageCode = 'jp' | 'en' | 'vn';

const ChooseLanguageScreen = () => {
  const { t } = useTranslation('common');
  const navigation = useNavigation<NativeStackNavigationProp<AuthenticationParamList>>();
  const dispatch = useAppDispatch();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | null>(null);

  type LanguageOption = {
    code: LanguageCode;
    label: string;
    iconType: IconProps['type'];
  };

  const languageOptions: LanguageOption[] = useMemo(
    () => [
      { code: 'jp' as LanguageCode, label: t('languageSelection.japanese'), iconType: 'jpIcon' },
      { code: 'en' as LanguageCode, label: t('languageSelection.english'), iconType: 'enIcon' },
      { code: 'vn' as LanguageCode, label: t('languageSelection.vietnamese'), iconType: 'vnIcon' },
    ],
    [t],
  );

  const handleSelectLanguage = async (language: LanguageCode) => {
    setSelectedLanguage(language);
    dispatch(setLanguageSetting(language));
    await i18n.changeLanguage(language);
  };

  const handleContinue = () => {
    if (!selectedLanguage) return;
    navigation.navigate('Onboarding');
  };

  return (
    <AppView
      flex={1}
      backgroundColor='background'
      paddingHorizontal='lg'
      paddingTop='3xl'
      paddingBottom='xl'
    >
      <AppView flex={1} alignItems='center' justifyContent='flex-start'>
        <AppView width='100%' maxWidth={320} marginTop='3xl' marginBottom='lg'>
          <AppText
            fontSize={24}
            lineHeight={33}
            fontWeight='700'
            fontFamily={FONT_FAMILIES.nunitoSans}
            textAlign='center'
            color='brightBlue'
            marginBottom='xl'
          >
            {t('languageSelection.title')}
          </AppText>
          <AppText
            fontSize={16}
            lineHeight={19}
            fontFamily={FONT_FAMILIES.nunitoSansRegular}
            fontWeight='500'
            textAlign='center'
            color='nearBlack'
          >
            {t('languageSelection.subtitle')}
          </AppText>
        </AppView>
        <AppView width='100%' maxWidth={320} marginTop='xl'>
          {languageOptions.map((option, index) => {
            const isSelected = option.code === selectedLanguage;
            return (
              <AppTouchableOpacity
                key={option.code}
                onPress={() => handleSelectLanguage(option.code)}
                width='100%'
                height={64}
                flexDirection='row'
                alignItems='center'
                justifyContent='space-between'
                borderWidth={1}
                borderColor={isSelected ? 'primary' : 'text100'}
                borderRadius='lg'
                backgroundColor='background'
                alignSelf='center'
                shadowColor='shadow'
                shadowOpacity={0.08}
                shadowRadius={6}
                shadowOffset={{ width: 0, height: 2 }}
                elevation={3}
                paddingHorizontal='lg'
                marginBottom={index < languageOptions.length - 1 ? 'sm' : 'none'}
              >
                <AppView flexDirection='row' alignItems='center'>
                  <AppView
                    width={32}
                    height={32}
                    borderRadius='sm'
                    alignItems='center'
                    justifyContent='center'
                    backgroundColor='background'
                    marginRight='sm'
                  >
                    <Icon type={option.iconType} width={32} height={32} />
                  </AppView>
                  <AppText
                    fontSize={13}
                    lineHeight={18}
                    fontWeight='400'
                    fontFamily={FONT_FAMILIES.beVietNamPro}
                    textAlign='left'
                    color='text400'
                  >
                    {option.label}
                  </AppText>
                </AppView>
                <AppView
                  width={16}
                  height={16}
                  borderRadius='round'
                  borderWidth={1}
                  borderColor={isSelected ? 'primary' : 'text100'}
                  backgroundColor='background'
                  alignItems='center'
                  justifyContent='center'
                >
                  {isSelected && (
                    <AppView
                      width={10}
                      height={10}
                      borderRadius='round'
                      backgroundColor='brightBlue'
                    />
                  )}
                </AppView>
              </AppTouchableOpacity>
            );
          })}
        </AppView>
      </AppView>
      <AppTouchableOpacity
        onPress={handleContinue}
        disabled={!selectedLanguage}
        width='100%'
        maxWidth={320}
        height={54}
        backgroundColor={selectedLanguage ? 'deepBlue' : 'background'}
        borderRadius='lg'
        borderWidth={2}
        borderColor={selectedLanguage ? 'deepBlue' : 'text100'}
        alignItems='center'
        justifyContent='center'
        alignSelf='center'
        paddingVertical='md'
        paddingHorizontal='lg'
        marginTop='lg'
        marginBottom='xs'
      >
        <AppText
          fontSize={16}
          lineHeight={20}
          fontWeight='700'
          fontFamily={FONT_FAMILIES.nunitoSans}
          color={selectedLanguage ? 'text000' : 'text200'}
        >
          {t('languageSelection.choose')}
        </AppText>
      </AppTouchableOpacity>
    </AppView>
  );
};

export default ChooseLanguageScreen;
