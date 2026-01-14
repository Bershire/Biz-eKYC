import React from 'react';
import { StyleSheet } from 'react-native';
import { ICONS } from 'src/assets/icons';
import { ViewRestyleProps } from 'src/theme/restyle';
import AppTouchableOpacity, {
  AppTouchableOpacityProps,
} from '../AppTouchableOpacity/AppTouchableOpacity';
import Icon from '../Icon/Icon';

export interface AppCheckbox extends AppTouchableOpacityProps, ViewRestyleProps {
  icon?: keyof typeof ICONS;
  type?: 'radio' | 'checkbox';
  isChecked: boolean | undefined;
  onPress: () => void;
}

export const AppCheckbox: React.FC<AppCheckbox> = ({ isChecked, onPress, type }) => {
  return (
    <AppTouchableOpacity onPress={onPress} style={style.container}>
      {type === 'checkbox' ?
        <Icon type={isChecked ? 'checkboxChecked' : 'checkboxUnchecked'} />
      : <Icon type={isChecked ? 'radioChecked' : 'radioUnchecked'} />}
    </AppTouchableOpacity>
  );
};

const style = StyleSheet.create({
  container: {
    paddingRight: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
});
