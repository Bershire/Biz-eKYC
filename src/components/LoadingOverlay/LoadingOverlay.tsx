import React, { useRef } from 'react';
import { Keyboard } from 'react-native';
import { COMMON_STYLES } from 'src/theme/styles';
import AppActivityIndicator, {
  AppActivityIndicatorProps,
} from '../AppActivityIndicator/AppActivityIndicator';
import AppView, { AppViewProps } from '../AppView/AppView';

export interface LoadingOverlayProps extends AppViewProps {
  visible?: boolean;
  firstFrameVisible?: boolean;
  hideKeyboardOnVisible?: boolean;
  activityIndicatorProps?: AppActivityIndicatorProps;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  firstFrameVisible,
  hideKeyboardOnVisible = true,
  activityIndicatorProps,
  ...rest
}) => {
  const firstFrameVisibleRef = useRef(firstFrameVisible);
  const loadingVisible = firstFrameVisibleRef.current || visible;
  firstFrameVisibleRef.current = false;

  if (hideKeyboardOnVisible && loadingVisible) Keyboard.dismiss();
  return (
    loadingVisible && (
      <AppView
        style={COMMON_STYLES.absoluteFill}
        backgroundColor='loadingBackdrop'
        justifyContent='center'
        alignItems='center'
        {...rest}
      >
        <AppActivityIndicator size='large' {...activityIndicatorProps} />
      </AppView>
    )
  );
};

export default LoadingOverlay;
