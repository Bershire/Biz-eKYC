import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FONT_FAMILIES } from 'src/assets/fonts';
import AppText from 'src/components/AppText/AppText';
import AppTextInput from 'src/components/AppTextInput/AppTextInput';
import AppTouchableOpacity from 'src/components/AppTouchableOpacity/AppTouchableOpacity';
import AppView from 'src/components/AppView/AppView';
import Icon from 'src/components/Icon/Icon';
import { OthersStackParamList } from 'src/navigation/OthersNavigator';
import { updatePersonalInfo } from 'src/store/personalInfo';
import { useAppDispatch, useAppSelector } from 'src/utils/useAppStore';
import OthersHeader from './components/OthersHeader';
import OthersSaveButton from './components/OthersSaveButton';

const PersonalInformationScreen = () => {
  const { t } = useTranslation('common');

  const navigation = useNavigation<NativeStackNavigationProp<OthersStackParamList>>();
  const dispatch = useAppDispatch();

  const personalInfo = useAppSelector(state => state.personalInfo);
  const [form, setForm] = useState(personalInfo);

  useEffect(() => {
    setForm(personalInfo);
  }, [personalInfo]);

  const isDirty = useMemo(() => {
    return (
      form.fullName !== personalInfo.fullName ||
      form.email !== personalInfo.email ||
      form.phone !== personalInfo.phone ||
      form.dob !== personalInfo.dob
    );
  }, [form, personalInfo]);

  const handleSave = () => {
    if (!isDirty) return;
    dispatch(updatePersonalInfo(form));
    navigation.goBack();
  };

  return (
      <AppView flex={1} backgroundColor='background'>
      <OthersHeader title={t('others.personalInformation')} />

      <AppView flex={1} paddingHorizontal='lg' paddingTop='lg'>
        <AppText
          fontSize={16}
          lineHeight={22}
          height={22}
          color='text500'
          fontFamily={FONT_FAMILIES.nunitoSansBold}
          fontWeight='700'
          marginBottom='xs'
        >
          {t('others.fullName')}
        </AppText>
        <AppView position='relative' marginBottom='md'>
          <AppTextInput
            value={form.fullName}
            onChange={fullName => setForm(prev => ({ ...prev, fullName }))}
            height={54}
            textInputProps={{
              fontSize: 16,
              fontFamily: FONT_FAMILIES.nunitoSansRegular,
              color: 'text500',
              paddingRight: 'xl',
            }}
          />
          <AppTouchableOpacity
            position='absolute'
            right={12}
            top={0}
            bottom={5}
            justifyContent='center'
            alignItems='center'
            onPress={() => setForm(prev => ({ ...prev, fullName: '' }))}
          >
            <Icon type='circleClose'/>
          </AppTouchableOpacity>
        </AppView>

        <AppText
          fontSize={16}
          lineHeight={22}
          height={22}
          color='text500'
          fontFamily={FONT_FAMILIES.nunitoSansBold}
          fontWeight='700'
          marginBottom='xs'
        >
          {t('others.email')}
        </AppText>
        <AppView position='relative' marginBottom='md'>
          <AppTextInput
            isEmail
            value={form.email}
            onChange={email => setForm(prev => ({ ...prev, email }))}
            height={54}
            textInputProps={{
              fontSize: 16,
              fontFamily: FONT_FAMILIES.nunitoSansRegular,
              color: 'text500',
              style: { paddingRight: 40 },
            }}
          />
          <AppTouchableOpacity
            position='absolute'
            right={12}
            top={0}
            bottom={5}
            justifyContent='center'
            alignItems='center'
            onPress={() => setForm(prev => ({ ...prev, email: '' }))}
          >
            <Icon type='circleClose'/>
          </AppTouchableOpacity>
        </AppView>

        <AppText
          fontSize={16}
          lineHeight={22}
          height={22}
          color='text500'
          fontFamily={FONT_FAMILIES.nunitoSansBold}
          fontWeight='700'
          marginBottom='xs'
        >
          {t('others.phoneNumber')}
        </AppText>
        <AppView position='relative' marginBottom='md'>
          <AppTextInput
            value={form.phone}
            onChange={phone => setForm(prev => ({ ...prev, phone }))}
            height={54}
            textInputProps={{
              fontSize: 16,
              fontFamily: FONT_FAMILIES.nunitoSansRegular,
              color: 'text500',
              style: { paddingRight: 40 },
            }}
          />
          <AppTouchableOpacity
            position='absolute'
            right={12}
            top={0}
            bottom={5}
            justifyContent='center'
            alignItems='center'
            onPress={() => setForm(prev => ({ ...prev, phone: '' }))}
          >
            <Icon type='circleClose'/>
          </AppTouchableOpacity>
        </AppView>

        <AppText
          fontSize={16}
          lineHeight={22}
          height={22}
          color='text500'
          fontFamily={FONT_FAMILIES.nunitoSansBold}
          fontWeight='700'
          marginBottom='xs'
        >
          {t('others.dateOfBirth')}
        </AppText>
        <AppView position='relative' marginBottom='xl'>
          <AppTextInput
            value={form.dob}
            onChange={dob => setForm(prev => ({ ...prev, dob }))}
            height={54}
            textInputProps={{
              fontSize: 16,
              fontFamily: FONT_FAMILIES.nunitoSansRegular,
              color: 'text500',
              style: { paddingRight: 40 },
            }}
          />
          <AppTouchableOpacity
            position='absolute'
            right={12}
            top={0}
            bottom={5}
            justifyContent='center'
            alignItems='center'
            onPress={() => setForm(prev => ({ ...prev, dob: '' }))}
          >
            <Icon type='date' />
          </AppTouchableOpacity>
        </AppView>

        <AppView flex={1} />
        <AppView marginBottom='xl'>
          <OthersSaveButton onPress={handleSave} alignSelf='center' disabled={!isDirty} />
        </AppView>
      </AppView>
    </AppView>
  );
};

export default PersonalInformationScreen;
