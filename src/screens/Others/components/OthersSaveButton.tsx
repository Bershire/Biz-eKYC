import React from 'react';
import { useTranslation } from 'react-i18next';
import AppButton, { AppButtonProps } from 'src/components/AppButton/AppButton';

type OthersSaveButtonProps = Omit<AppButtonProps, 'text' | 'type'> & {
  text?: string;
};

const OthersSaveButton: React.FC<OthersSaveButtonProps> = ({ text, disabled, ...rest }) => {
  const { t } = useTranslation('common');

  return (
    <AppButton
      text={text ?? t('others.saveChanges')}
      height={54}
      width='100%'
      alignSelf='stretch'
      backgroundColor={disabled ? 'softGray' : 'deepBlue'}
      textStyle={{
        fontSize: 16,
        lineHeight: 22,
        color: disabled ? 'coolGray' : 'primaryContrast',
      }}
      style={{ borderRadius: 8 }}
      disabled={disabled}
      {...rest}
    />
  );
};

export default OthersSaveButton;
