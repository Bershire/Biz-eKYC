import { useTheme } from '@shopify/restyle';
import React, { memo, useEffect, useRef, useState } from 'react';
import { NativeEventEmitter, NativeModule, NativeModules } from 'react-native';
import { IS_ANDROID } from 'src/constants/device';
import { Theme } from 'src/theme/theme';
import {
  NavigationBarStackProps,
  popStackEntry,
  pushStackEntry,
  replaceStackEntry,
} from './utils/stackManager';

export interface AppSystemNavigationBarProps {
  barStyle?: 'dark-content' | 'light-content';
  transparent?: boolean;
}

const systemNavigationTypes = ['gesture', 'twoButton', 'threeButton'] as const;
export type SystemNavigationType = (typeof systemNavigationTypes)[number];
type SystemNavigationModule = {
  getSystemNavigationType?: () => Promise<SystemNavigationType | null>;
} | null;

const SystemNavigationModule = NativeModules.SystemNavigationModule as SystemNavigationModule;

const eventEmitter =
  IS_ANDROID ?
    new NativeEventEmitter(NativeModules.SystemNavigationModule as NativeModule)
  : undefined;
let systemNavigationBarEverRecognized = false;

const AppSystemNavigationBar: React.FC<AppSystemNavigationBarProps> = memo(
  ({ barStyle, transparent }) => {
    const theme = useTheme<Theme>();
    const [barType, setBarType] = useState<SystemNavigationType | 'unrecognized'>();

    useEffect(() => {
      SystemNavigationModule?.getSystemNavigationType?.()
        .then(type => {
          setBarType(isSystemNavigationType(type) ? type : 'unrecognized');
        })
        .catch(() => setBarType('unrecognized'));
      const eventListener = eventEmitter?.addListener('SystemNavigationTypeChanged', event => {
        setBarType(isSystemNavigationType(event) ? event : 'unrecognized');
      });

      return () => eventListener?.remove();
    }, []);

    if (!systemNavigationBarEverRecognized && barType && barType !== 'unrecognized')
      systemNavigationBarEverRecognized = true;
    const stackEntry = useRef<NavigationBarStackProps>();

    if (IS_ANDROID && barType && systemNavigationBarEverRecognized) {
      const isTransparent = (barType !== 'unrecognized' && transparent) || barType === 'gesture';

      const newStackProps = {
        barColor: isTransparent ? theme.colors.transparent : theme.colors.systemBarScrimBackground,
        barStyle:
          barType !== 'unrecognized' && barStyle ?
            barStyle === 'dark-content' ?
              'dark'
            : 'light'
          : isTransparent ? 'dark'
          : 'light',
      } as const;

      stackEntry.current =
        stackEntry.current ?
          replaceStackEntry(stackEntry.current, newStackProps)
        : pushStackEntry(newStackProps);
    }
    useEffect(() => {
      return () => {
        if (stackEntry.current) {
          popStackEntry(stackEntry.current);
        }
      };
    }, []);

    return undefined;
  },
);

export default AppSystemNavigationBar;

function isSystemNavigationType(value: unknown): value is SystemNavigationType {
  return systemNavigationTypes.includes(value as SystemNavigationType);
}
