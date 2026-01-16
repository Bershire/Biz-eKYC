import React, { useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { AuthenticationParamList } from '../../navigation/Authentication';
import { ICONS } from '../../assets/icons';
import { FONT_FAMILIES } from '../../assets/fonts';
import AppText from 'src/components/AppText/AppText';
import AppTouchableOpacity from 'src/components/AppTouchableOpacity/AppTouchableOpacity';
import AppView from 'src/components/AppView/AppView';
type LanguageCode = 'jp' | 'en' | 'vn';

const ChooseLanguageScreen = () => {
	const { t } = useTranslation('common');
	const navigation = useNavigation<NativeStackNavigationProp<AuthenticationParamList>>();
	const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | null>(null);

	const languageOptions = useMemo(
		() => [
			{ code: 'jp' as LanguageCode, label: t('languageSelection.japanese'), Icon: ICONS.jp },
			{ code: 'en' as LanguageCode, label: t('languageSelection.english'), Icon: ICONS.en },
			{ code: 'vn' as LanguageCode, label: t('languageSelection.vietnamese'), Icon: ICONS.vn },
		],
		[t],
	);

	const handleSelectLanguage = async (language: LanguageCode) => {
		setSelectedLanguage(language);
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
			paddingTop='xl'
			paddingBottom='xl'
		>
			<AppView flex={1} alignItems='center'>
				<AppView width='100%' maxWidth={320} marginTop='xl' marginBottom='lg'>
					<AppText
						fontSize={18}
						lineHeight={24}
						fontWeight='700'
						fontFamily={FONT_FAMILIES.nunitoSans}
						textAlign='center'
						color='primary'
						marginBottom='sm'
					>
						{t('languageSelection.title')}
					</AppText>
					<AppText
						fontSize={12}
						lineHeight={18}
						fontWeight='400'
						fontFamily={FONT_FAMILIES.nunitoSans}
						textAlign='center'
						color='text300'
					>
						{t('languageSelection.subtitle')}
					</AppText>
				</AppView>
				<AppView width='100%' maxWidth={320}>
					{languageOptions.map((option, index) => {
						const isSelected = option.code === selectedLanguage;
						const Icon = option.Icon;
						return (
								<AppTouchableOpacity
									key={option.code}
									onPress={() => handleSelectLanguage(option.code)}
									width='100%'
								height={56}
								flexDirection='row'
								alignItems='center'
								justifyContent='space-between'
								borderWidth={1}
								borderColor={isSelected ? 'primary' : 'text100'}
								borderRadius='md'
								backgroundColor='background'
								alignSelf='center'
								shadowColor='shadow'
								shadowOpacity={0.08}
								shadowRadius={6}
								shadowOffset={{ width: 0, height: 2 }}
								elevation={3}
								paddingHorizontal='md'
								marginBottom={index < languageOptions.length - 1 ? 'sm' : 'none'}
							>
								<AppView
									flexDirection='row'
									alignItems='center'
								>
									<AppView
										width={32}
										height={32}
										borderRadius='sm'
										alignItems='center'
										justifyContent='center'
										backgroundColor='background'
										marginRight='sm'
									>
										<Icon width={32} height={32} />
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
											backgroundColor='primary'
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
				backgroundColor={selectedLanguage ? 'primary' : 'background'}
				borderRadius='md'
				borderWidth={2}
				borderColor={selectedLanguage ? 'primary' : 'text100'}
				alignItems='center'
				justifyContent='center'
				alignSelf='center'
				paddingVertical='md'
				paddingHorizontal='lg'
				marginTop='lg'
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
