import React from 'react';
import { useTranslation } from 'react-i18next';
import AppActivityIndicator from 'src/components/AppActivityIndicator/AppActivityIndicator';
import AppButton from 'src/components/AppButton/AppButton';
import AppText from 'src/components/AppText/AppText';
import AppView, { AppViewProps } from 'src/components/AppView/AppView';

export interface AppListFooterProps extends AppViewProps {
  errorMessage?: string;
  showFooterLoading?: boolean;
  onTryAgain?: () => void;
  hidden?: boolean;
}

const AppListFooter: React.FC<AppListFooterProps> = ({
  errorMessage,
  showFooterLoading,
  onTryAgain,
  hidden,
  ...rest
}) => {
  const { t } = useTranslation('common');

  return (
    !hidden &&
    (errorMessage || showFooterLoading) && (
      <AppView paddingHorizontal='xl' {...rest}>
        {errorMessage ?
          <>
            <AppText variant='title' color='text200' textAlign='center' marginBottom='md'>
              {errorMessage}
            </AppText>
            <AppButton type='primary' text={t('tryAgain')} onPress={onTryAgain} />
          </>
        : showFooterLoading && <AppActivityIndicator size='large' paddingVertical='xl' />}
      </AppView>
    )
  );
};

export default AppListFooter;
