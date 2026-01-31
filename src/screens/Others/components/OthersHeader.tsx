import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMAGES } from 'src/assets/images';
import { FONT_FAMILIES } from 'src/assets/fonts';
import { AppImageBackground } from 'src/components/AppImage/AppImage';
import AppText from 'src/components/AppText/AppText';
import AppTouchableOpacity from 'src/components/AppTouchableOpacity/AppTouchableOpacity';
import AppView from 'src/components/AppView/AppView';
import Icon from 'src/components/Icon/Icon';

type OthersHeaderProps = {
  title: string;
  height?: number;
  showBack?: boolean;
  onBackPress?: () => void;
};

const OthersHeader: React.FC<OthersHeaderProps> = ({
  title,
  height = 117,
  showBack = true,
  onBackPress,
}) => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  return (
    <AppImageBackground
      source={IMAGES.loginBackground}
      resizeMode='cover'
      backgroundColor='deepBlue'
      height={height}
      paddingTop='lg'
      paddingBottom='lg'
      justifyContent='center'
      paddingHorizontal='md'
    >
      <AppView flexDirection='row' alignItems='center'>
        {showBack && (
          <AppTouchableOpacity
            onPress={onBackPress ?? (() => navigation.goBack())}
            width={32}
            height={32}
            alignItems='center'
            justifyContent='center'
            marginRight='sm'
            marginLeft='sm'
          >
            <Icon type='back' width={32} height={32} color='text000' />
          </AppTouchableOpacity>
        )}
        <AppView flex={1} alignItems='center'>
          <AppText
            fontSize={24}
            height={33}
            lineHeight={33}
            color='text000'
            textAlign='center'
            fontFamily={FONT_FAMILIES.nunitoSansBold}
          >
            {title}
          </AppText>
        </AppView>
        {showBack ? <AppView width={32} /> : null}
      </AppView>
    </AppImageBackground>
  );
};

export default OthersHeader;
