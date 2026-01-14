import { toast } from '@backpackapp-io/react-native-toast';
import { useIsFocused } from '@react-navigation/core';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  Camera,
  CameraProps,
  CameraRuntimeError,
  useCameraPermission,
} from 'react-native-vision-camera';
import { ICONS } from 'src/assets/icons';
import { COMMON_STYLES } from 'src/theme/styles';
import { useAppState } from 'src/utils/useAppState';
import AppView from '../AppView/AppView';
import Icon from '../Icon/Icon';
import RestyleHoleView, {
  RestyleHoleViewProps,
} from './components/RestyleHoleView/RestyleHoleView';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export interface AppCameraProps
  extends PartialBy<Omit<CameraProps, 'style'>, 'device' | 'isActive'> {
  cameraHole?: RestyleHoleViewProps['hole'];
  cameraHoleCorner?: keyof typeof ICONS;
  onCameraPermissionDenied?: () => void;
  onCameraReadyStateChanged?: (isReady: boolean) => void;
}

const AppCamera = forwardRef<Camera, AppCameraProps>(
  (
    {
      device,
      cameraHole,
      cameraHoleCorner,
      isActive,
      onStarted,
      onError,
      onCameraPermissionDenied,
      onCameraReadyStateChanged,
      ...rest
    },
    ref,
  ) => {
    const { t } = useTranslation('common');
    const isFocused = useIsFocused();
    const { foreground } = useAppState();

    const { hasPermission, requestPermission } = useCameraPermission();
    const onErrorRef = useRef<AppCameraProps['onError']>();
    onErrorRef.current = onError;
    const onCameraPermissionDeniedRef = useRef<AppCameraProps['onCameraPermissionDenied']>();
    onCameraPermissionDeniedRef.current = onCameraPermissionDenied;
    const onCameraReadyStateChangedRef = useRef<AppCameraProps['onCameraReadyStateChanged']>();
    onCameraReadyStateChangedRef.current = onCameraReadyStateChanged;

    useEffect(() => {
      if (!hasPermission) {
        requestPermission()
          .then(permission => {
            console.log(`Camera permission status: ${permission}`);
            if (!permission) {
              onCameraPermissionDeniedRef.current?.();
              onCameraReadyStateChangedRef.current?.(false);
              toast.error(t('cameraPermissionDenied'));
            }
          })
          .catch(error => {
            if (error instanceof CameraRuntimeError) {
              onErrorRef.current?.(error);
              onCameraReadyStateChangedRef.current?.(false);
            }
            toast.error(t('genericErrorMessage'));
          });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- only request permission once
    }, [hasPermission]);

    useFocusEffect(
      useCallback(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        return () => ScreenOrientation.unlockAsync();
      }, []),
    );

    return (
      <AppView position='relative'>
        {!!device && hasPermission && isFocused && (
          <Camera
            ref={ref}
            style={{ height: '100%' }}
            device={device}
            isActive={(isActive ?? true) && foreground}
            onError={error => {
              onError?.(error);
              console.log(error);
              toast.error(t('genericErrorMessage'));
            }}
            onStarted={() => {
              onStarted?.();
              onCameraReadyStateChanged?.(true);
            }}
            {...rest}
          />
        )}
        <RestyleHoleView
          hole={cameraHole}
          backgroundColor='cameraBackdrop'
          style={COMMON_STYLES.absoluteFill}
        />

        {!!cameraHoleCorner && (
          <View
            style={{
              position: 'absolute',
              left: cameraHole?.x,
              top: cameraHole?.y,
              width: cameraHole?.width,
              height: cameraHole?.height,
            }}
          >
            <Icon type={cameraHoleCorner} position='absolute' />
            <Icon
              type={cameraHoleCorner}
              position='absolute'
              right={0}
              transform={[{ rotate: '90deg' }]}
            />
            <Icon
              type={cameraHoleCorner}
              position='absolute'
              bottom={0}
              transform={[{ rotate: '270deg' }]}
            />
            <Icon
              type={cameraHoleCorner}
              position='absolute'
              right={0}
              bottom={0}
              transform={[{ rotate: '180deg' }]}
            />
          </View>
        )}
      </AppView>
    );
  },
);

export default AppCamera;
