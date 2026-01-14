import React from 'react';
import { Control, Controller, FieldValues, Path, UseControllerReturn } from 'react-hook-form';
import AppText, { AppTextProps } from 'src/components/AppText/AppText';
import AppView, { AppViewProps } from 'src/components/AppView/AppView';

export type InputWrapperChildren<T extends FieldValues> = UseControllerReturn<T> & {
  control: Control<T>;
};

export interface AppFormInputWrapperProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  shouldUnregister?: boolean;
  children: (value: InputWrapperChildren<T>) => React.ReactNode;
  label?: string;
  labelProps?: AppTextProps;
  errorProps?: AppTextProps;
  wrapperProps?: AppViewProps;
  mandatory?: boolean;
}

const AppFormInputWrapper = <T extends FieldValues>({
  control,
  name,
  shouldUnregister,
  children,
  label,
  labelProps,
  errorProps,
  wrapperProps,
  mandatory,
}: AppFormInputWrapperProps<T>): React.ReactElement<AppFormInputWrapperProps<T>> => {
  return (
    <Controller
      control={control}
      name={name}
      shouldUnregister={shouldUnregister}
      render={value => (
        <AppView {...wrapperProps}>
          {!!label && (
            <AppText variant='homeText14w600' color='text300' marginBottom='2xs' {...labelProps}>
              {label}
              {mandatory && (
                <AppText variant='homeText14w600' color='danger'>
                  {' *'}
                </AppText>
              )}
            </AppText>
          )}

          {children({ ...value, control })}

          {!!value.fieldState.error?.message && (
            <AppText variant='homeText12w400' color='danger' marginTop='2xs' {...errorProps}>
              {value.fieldState.error.message}
            </AppText>
          )}
        </AppView>
      )}
    />
  );
};

export default AppFormInputWrapper;
