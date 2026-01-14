import { useFocusEffect } from '@react-navigation/core';
import {
  VariantProps,
  createRestyleComponent,
  createVariant,
  useResponsiveProp,
  useTheme,
} from '@shopify/restyle';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputProps,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { ICONS } from 'src/assets/icons';
import { IS_ANDROID } from 'src/constants/device';
import { TextRestyleProps, textFunctions } from 'src/theme/restyle';
import { Theme } from 'src/theme/theme';
import { addColorAlpha } from 'src/utils/addColorAlpha';
import { useLayout } from 'src/utils/useLayout';
import AppButton from '../AppButton/AppButton';
import AppView, { AppViewProps } from '../AppView/AppView';
import Icon, { IconProps } from '../Icon/Icon';

interface RestyleTextInputProps
  extends Omit<TextInputProps, 'textAlign' | 'textAlignVertical' | 'verticalAlign'>,
    TextRestyleProps,
    VariantProps<Theme, 'textInputVariants', 'textInputVariant'>,
    VariantProps<Theme, 'viewVariants', 'viewVariant'> {}

export interface AppTextInputProps extends Omit<AppViewProps, 'variant'> {
  variant?: RestyleTextInputProps['textInputVariant'];
  viewVariant?: AppViewProps['variant'];
  icon?: keyof typeof ICONS | IconProps;
  iconPosition?: 'left' | 'right';
  isPassword?: boolean;
  isEmail?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: RestyleTextInputProps['onBlur'];
  placeholder?: string;
  multiline?: boolean;
  submitBehavior?: 'submit' | 'blurAndSubmit' | 'newline';
  onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void | boolean;
  textInputProps?: Omit<
    RestyleTextInputProps,
    | 'textInputVariant'
    | 'value'
    | 'onChangeText'
    | 'placeholder'
    | 'multiline'
    | 'onBlur'
    | 'onSubmitEditing'
    | 'blurOnSubmit'
  >;
  confirmBtnLabel?: string;
  headerComponent?: React.ReactNode;
}

const RestyleTextInput = createRestyleComponent<RestyleTextInputProps, Theme>(
  [
    ...textFunctions,
    createVariant({ property: 'textInputVariant', themeKey: 'textInputVariants' }),
    createVariant({ property: 'viewVariant', themeKey: 'viewVariants' }),
  ],
  TextInput,
);

const PASSWORD_VISIBILITY_ICON_SIZE = 24;

const passwordProps = {
  autoCapitalize: 'none',
  autoCorrect: false,
  textContentType: 'password',
} as const;

const emailProps = {
  keyboardType: 'email-address',
  autoCapitalize: 'none',
  autoCorrect: false,
  textContentType: 'emailAddress',
  autoComplete: 'email',
} as const;

const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
  (
    {
      variant = 'primary',
      icon,
      iconPosition = 'left',
      isPassword,
      isEmail,
      value,
      defaultValue,
      onChange,
      onBlur,
      placeholder,
      multiline,
      textInputProps,
      confirmBtnLabel,
      submitBehavior,
      onSubmitEditing,
      headerComponent,
      ...rest
    },
    ref,
  ) => {
    const { colors, spacing } = useTheme<Theme>();
    const innerRef = useRef<TextInput>(null);
    const currentValueRef = useRef('');
    const [passwordHidden, setPasswordHidden] = useState(isPassword);
    const variantProp = useResponsiveProp(variant);
    const { t } = useTranslation('common');

    const [{ onLayout }, { width: iconWidth }] = useLayout();
    const iconProps = icon && typeof icon === 'string' ? { type: icon } : icon;

    const reallyIsPassword = isPassword && !multiline;

    useFocusEffect(
      useCallback(() => {
        return () => {
          if (reallyIsPassword) {
            onChange?.('');
          }
        };
      }, [reallyIsPassword, onChange]),
    );

    useImperativeHandle(ref, () => innerRef.current as TextInput);

    const [pauseLoadingFontFamily, setPauseLoadingFontFamily] = useState(true);
    useLayoutEffect(() => {
      // HACK: delays loading fontFamily to workaround this issue on some android devices:
      // https://github.com/facebook/react-native/issues/45853
      setPauseLoadingFontFamily(false);
    }, [pauseLoadingFontFamily]);

    const blurOnSubmit = submitBehavior === 'blurAndSubmit' || (!submitBehavior && !multiline);

    return (
      <AppView
        {...rest}
        variant={rest.viewVariant}
        flexDirection={variantProp === 'withConfirmBtn' ? 'row' : rest.flexDirection}
      >
        {headerComponent}

        <RestyleTextInput
          ref={innerRef}
          value={value}
          defaultValue={defaultValue}
          onChangeText={text => {
            currentValueRef.current = text;
            onChange?.(text);
          }}
          onBlur={onBlur}
          enterKeyHint={variantProp === 'withConfirmBtn' ? 'done' : undefined}
          enablesReturnKeyAutomatically
          placeholder={placeholder}
          placeholderTextColor={colors.text100}
          selectionColor={addColorAlpha(colors.primary, 0.5)}
          multiline={multiline}
          minHeight={40}
          textInputVariant={variantProp}
          variant={variantProp === 'withConfirmBtn' ? 'textInputWithConfirmBtn' : 'textInput'}
          // @ts-expect-error -- missing props: https://github.com/facebook/react-native/commit/1dcbf41725a7296c0a0f33c4e0cc3a11e8780889
          submitBehavior={blurOnSubmit ? 'submit' : submitBehavior}
          onSubmitEditing={e => {
            const willBlur = onSubmitEditing?.(e) ?? blurOnSubmit;
            if (willBlur) innerRef.current?.blur();
          }}
          secureTextEntry={reallyIsPassword && passwordHidden}
          keyboardType={
            IS_ANDROID && reallyIsPassword && !passwordHidden ? 'visible-password' : undefined
          }
          {...(reallyIsPassword ? passwordProps : undefined)}
          {...(isEmail ? emailProps : undefined)}
          {...textInputProps}
          style={[
            {
              paddingLeft: (iconPosition === 'left' && iconWidth) || spacing.sm,
              paddingRight:
                (reallyIsPassword ? PASSWORD_VISIBILITY_ICON_SIZE + spacing.xs : 0) +
                ((iconPosition === 'right' && iconWidth) || spacing.sm),
            },
            IS_ANDROID && pauseLoadingFontFamily ? { fontFamily: '' } : undefined,

            // workarounds for https://github.com/facebook/react-native/pull/37998
            IS_ANDROID ? { lineHeight: undefined } : undefined,

            textInputProps?.style,
          ]}
        />

        <AppView
          position='absolute'
          height='100%'
          right={
            iconPosition === 'right' ?
              reallyIsPassword ?
                PASSWORD_VISIBILITY_ICON_SIZE + spacing.xs
              : 0
            : undefined
          }
          onLayout={onLayout}
          onTouchEnd={() => innerRef.current?.focus()}
        >
          {iconProps && <Icon height='100%' marginLeft='xs' marginRight='xs' {...iconProps} />}
        </AppView>
        {reallyIsPassword && variantProp !== 'withConfirmBtn' && (
          <AppButton
            icon={passwordHidden ? 'eye' : 'eyeClosed'}
            onPress={() => {
              setPasswordHidden(pre => !pre);
              setPauseLoadingFontFamily(true);
            }}
            iconStyle={{
              width: PASSWORD_VISIBILITY_ICON_SIZE,
            }}
            position='absolute'
            height='100%'
            alignSelf='flex-end'
            paddingRight='xs'
            hitSlop={10}
          />
        )}

        {variantProp === 'withConfirmBtn' && (
          <AppButton
            type='primary'
            paddingHorizontal='md'
            borderRadius={undefined}
            borderTopRightRadius='lg'
            borderBottomRightRadius='lg'
            text={confirmBtnLabel || t('button.confirm')}
            onPress={e => {
              const willBlur = onSubmitEditing?.({
                ...e,
                nativeEvent: { text: currentValueRef.current },
              });
              if (willBlur !== false) innerRef.current?.blur();
            }}
          />
        )}
      </AppView>
    );
  },
);

export default AppTextInput;
