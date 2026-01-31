import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FONT_FAMILIES } from 'src/assets/fonts';
import AppText from 'src/components/AppText/AppText';
import AppTouchableOpacity from 'src/components/AppTouchableOpacity/AppTouchableOpacity';
import AppView from 'src/components/AppView/AppView';
import Icon, { IconProps } from 'src/components/Icon/Icon';
import i18n from 'src/i18n/i18n';
import { OthersStackParamList } from 'src/navigation/OthersNavigator';
import { setLanguageSetting } from 'src/store/settings';
import { useAppDispatch, useAppSelector } from 'src/utils/useAppStore';
import OthersHeader from './components/OthersHeader';
import OthersSaveButton from './components/OthersSaveButton';

type LanguageCode = 'jp' | 'en' | 'vn';

type LanguageOption = {
  code: LanguageCode;
  label: string;
  iconType: IconProps['type'];
};

const LanguageScreen = () => {
  const { t } = useTranslation('common');
  const navigation = useNavigation<NativeStackNavigationProp<OthersStackParamList>>();
  const dispatch = useAppDispatch();
  const languageSetting = useAppSelector(state => state.settings.language) as LanguageCode | undefined;
  const currentLanguage = (languageSetting ?? (i18n.language as LanguageCode) ?? 'en') as LanguageCode;
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(currentLanguage);

  const languageOptions: LanguageOption[] = useMemo(
    () => [
      { code: 'jp', label: t('languageSelection.japanese'), iconType: 'jpIcon' },
      { code: 'en', label: t('languageSelection.english'), iconType: 'enIcon' },
      { code: 'vn', label: t('languageSelection.vietnamese'), iconType: 'vnIcon' },
    ],
    [t],
  );

  const isDirty = selectedLanguage !== currentLanguage;

  const handleSave = async () => {
    if (!isDirty) return;
    dispatch(setLanguageSetting(selectedLanguage));
    await i18n.changeLanguage(selectedLanguage);
    navigation.goBack();
  };

  return (
    <AppView flex={1} backgroundColor='background'>
      <OthersHeader title={t('others.language')} />

      <AppView flex={1} paddingHorizontal='lg' paddingTop='lg'>
        {languageOptions.map((option, index) => {
          const isSelected = option.code === selectedLanguage;
          return (
            <AppTouchableOpacity
              key={option.code}
              onPress={() => setSelectedLanguage(option.code)}
              height={64}
              flexDirection='row'
              alignItems='center'
              justifyContent='space-between'
              borderWidth={1}
              borderColor={isSelected ? 'deepBlue' : 'text050'}
              borderRadius='lg'
              backgroundColor={isSelected ? 'chooseLanguageBackground' : 'background'}
              paddingHorizontal='md'
              marginBottom={index < languageOptions.length - 1 ? 'sm' : 'none'}
              shadowOffset={{ width: 0, height: 2 }}
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
                  fontSize={12}
                  lineHeight={20}
                  fontWeight='500'
                  fontFamily={FONT_FAMILIES.beVietNamPro}
                  textAlign='left'
                  color='text500'
                >
                  {option.label}
                </AppText>
              </AppView>
              <AppView
                width={20}
                height={20}
                borderRadius='round'
                borderWidth={1.5}
                borderColor={isSelected ? 'deepBlue' : 'text100'}
                backgroundColor='background'
                alignItems='center'
                justifyContent='center'
              >
                {isSelected && (
                  <AppView width={10} height={10} borderRadius='round' backgroundColor='deepBlue' />
                )}
              </AppView>
            </AppTouchableOpacity>
          );
        })}

        <AppView flex={1} />
        <AppView marginBottom='xl'>
          <OthersSaveButton onPress={handleSave} alignSelf='center' disabled={!isDirty} />
        </AppView>
      </AppView>
    </AppView>
  );
};

export default LanguageScreen;
