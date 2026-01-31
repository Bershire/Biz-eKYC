import React from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import AppTouchableOpacity from 'src/components/AppTouchableOpacity/AppTouchableOpacity';
import AppView from 'src/components/AppView/AppView';
import AppText from 'src/components/AppText/AppText';
import Icon, { IconProps } from 'src/components/Icon/Icon';
import { FONT_FAMILIES } from 'src/assets/fonts';
import i18n from 'src/i18n/i18n';
import { OthersStackParamList } from 'src/navigation/OthersNavigator';
import { useAppSelector } from 'src/utils/useAppStore';
import OthersHeader from './components/OthersHeader';

const OthersScreen = () => {
  const { t } = useTranslation('common');
  const navigation = useNavigation<NativeStackNavigationProp<OthersStackParamList>>();
  const personalInfoState = useAppSelector(state => state.personalInfo);
  const settings = useAppSelector(state => state.settings);
  const currentLanguage = (settings.language ?? (i18n.language as 'jp' | 'en' | 'vn') ?? 'en') as
    | 'jp'
    | 'en'
    | 'vn';
  const languageLabel =
    currentLanguage === 'jp' ?
      t('languageSelection.japanese')
    : currentLanguage === 'vn' ?
      t('languageSelection.vietnamese')
    : t('languageSelection.english');

  const personalInfo = [
    { key: 'fullName', label: t('others.fullName'), value: personalInfoState.fullName, icon: 'fullname' },
    { key: 'email', label: t('others.email'), value: personalInfoState.email, icon: 'email' },
    { key: 'phone', label: t('others.phoneNumber'), value: personalInfoState.phone, icon: 'phoneNumber' },
    { key: 'dob', label: t('others.dateOfBirth'), value: personalInfoState.dob, icon: 'date' },
  ] as const satisfies ReadonlyArray<{
    key: string;
    label: string;
    value: string;
    icon: IconProps['type'];
  }>;

  const legalItems = [
    { key: 'changePassword', label: t('others.changePassword'), icon: 'changePassword' },
    { key: 'termsOfService', label: t('others.termsOfService'), icon: 'termsOfService' },
    { key: 'userGuide', label: t('others.userGuide'), icon: 'userGuide' },
  ] as const satisfies ReadonlyArray<{
    key: string;
    label: string;
    icon: IconProps['type'];
  }>;

  const renderRow = (
    label: string,
    value?: string,
    showChevron?: boolean,
    iconType?: IconProps['type'],
  ) => (
    <AppView
      flexDirection='row'
      alignItems='center'
      justifyContent='space-between'
      paddingVertical='sm'
    >
      <AppView flexDirection='row' alignItems='center'>
        <AppView
          width={28}
          height={28}
          borderRadius='lg'
          alignItems='center'
          justifyContent='center'
          marginRight='xs'
        >
          {iconType ? (
            <Icon type={iconType} width={20} height={20} color='text300' />
          ) : (
            <AppText fontSize={12} lineHeight={14} color='text300' fontFamily={FONT_FAMILIES.nunitoSans}>
              •
            </AppText>
          )}
        </AppView>
        <AppText fontSize={16} lineHeight={22} color='text500' fontFamily={FONT_FAMILIES.nunitoSansRegular}>
          {label}
          {value ? ': ' : ''}
          {value ? (
            <AppText fontSize={16} lineHeight={22} color='text100' fontFamily={FONT_FAMILIES.nunitoSansRegular}>
              {value}
            </AppText>
          ) : null}
        </AppText>
      </AppView>
      {showChevron && (
        <Icon
          type='rightVec'
          width={20}
          height={20}
          color='backgroundContrast'
        />
      )}
    </AppView>
  );

  return (
    <AppView flex={1} backgroundColor='gainsboro'>
      <OthersHeader title={t('screens.others')} showBack={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 12 }}
      >
        <AppView paddingHorizontal='lg'>
          <AppView marginBottom='md'>
            <AppView
              flexDirection='row'
              alignItems='center'
              justifyContent='space-between'
              marginBottom='sm'
            >
              <AppText
                fontSize={16}
                lineHeight={22}
                height={22}
                color='deepBlue'
                fontFamily={FONT_FAMILIES.nunitoSansBold}
                fontWeight='700'
                marginTop='xs'
              >
                {t('others.personalInformation')}
              </AppText>
              <AppTouchableOpacity onPress={() => navigation.navigate('PersonalInformation')}>
                <AppView
                  width={24}
                  height={24}
                  borderRadius='lg'
                  alignItems='center'
                  justifyContent='center'
                >
                  <Icon type='editPersonalInfo' width={24} height={24} color='deepBlue' />
                </AppView>
              </AppTouchableOpacity>
            </AppView>
            <AppView
              backgroundColor='background'
              borderRadius='lg'
              paddingHorizontal='md'
              paddingVertical='xs'
              variant='sShadow'
            >
              {personalInfo.map((item, index) => (
                <AppView key={item.key}>
                  {renderRow(item.label, item.value, undefined, item.icon)}
                  {index < personalInfo.length - 1 && (
                    <AppView
                      height={1}
                      backgroundColor='text050'
                      marginVertical='2xs'
                    />
                  )}
                </AppView>
              ))}
            </AppView>
          </AppView>

          <AppView marginBottom='xl' height={70}>
            <AppText
              fontSize={16}
              lineHeight={22}
              height={22}
              color='deepBlue'
              fontFamily={FONT_FAMILIES.nunitoSansBold}
              fontWeight='700'
              marginBottom='sm'
            >
              {t('others.systemSettings')}
            </AppText>
            <AppView
              backgroundColor='background'
              borderRadius='lg'
              paddingHorizontal='sm'
              paddingVertical='xs'
              variant='sShadow'
            >
              <AppTouchableOpacity onPress={() => navigation.navigate('Language')}>
                {renderRow(t('others.language'), languageLabel, true, 'language')}
              </AppTouchableOpacity>
            </AppView>
          </AppView>

          <AppView marginBottom='md' marginTop='md'>
            <AppText
              fontSize={16}
              lineHeight={22}
              height={22}
              color='deepBlue'
              fontFamily={FONT_FAMILIES.nunitoSansBold}
              fontWeight='700'
              marginBottom='sm'
            >
              {t('others.informationLegal')}
            </AppText>
            <AppView
              backgroundColor='background'
              borderRadius='lg'
              paddingHorizontal='md'
              paddingVertical='xs'
              variant='sShadow'
            >
              {legalItems.map((item, index) => (
                <AppView key={item.key}>
                  {renderRow(item.label, undefined, true, item.icon)}
                  {index < legalItems.length - 1 && (
                    <AppView height={1} backgroundColor='text050' marginVertical='xs' />
                  )}
                </AppView>
              ))}
            </AppView>
          </AppView>
        </AppView>
      </ScrollView>
    </AppView>
  );
};

export default OthersScreen;
