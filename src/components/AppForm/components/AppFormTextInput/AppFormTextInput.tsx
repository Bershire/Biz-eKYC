import React from 'react';
import { FieldValues } from 'react-hook-form';
import AppTextInput, { AppTextInputProps } from 'src/components/AppTextInput/AppTextInput';
import AppFormInputWrapper, {
  AppFormInputWrapperProps,
} from '../AppFormInputWrapper/AppFormInputWrapper';

export interface AppFormTextInputProps<T extends FieldValues>
  extends Omit<AppFormInputWrapperProps<T>, 'children'>,
    Omit<AppTextInputProps, 'onChange' | 'value'> {
  mask?: (value: string) => string | undefined;
}

const AppFormTextInput = <T extends FieldValues>({
  children,
  mask,
  ...rest
}: AppFormTextInputProps<T>): React.ReactElement<AppFormTextInputProps<T>> => {
  return (
    <AppFormInputWrapper {...rest}>
      {({ field: { onChange, onBlur, value, ref } }) => (
        <AppTextInput
          ref={ref}
          onChange={
            mask ?
              newValue => {
                const maskedValue = mask(newValue);
                if (maskedValue !== undefined) onChange(maskedValue);
              }
            : onChange
          }
          onBlur={onBlur}
          value={value}
          {...rest}
          children={children}
        />
      )}
    </AppFormInputWrapper>
  );
};

export default AppFormTextInput;
