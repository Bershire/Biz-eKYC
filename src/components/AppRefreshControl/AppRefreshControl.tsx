import { useTheme } from '@shopify/restyle';
import React, { forwardRef } from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';
import { IS_IOS } from 'src/constants/device';
import { Theme } from 'src/theme/theme';

export interface AppRefreshControlProps extends Omit<RefreshControlProps, 'enabled'> {
  /**
   * Enabled that works on both Android and iOS
   */
  enabled?: boolean;
}

const AppRefreshControl = forwardRef<RefreshControl, AppRefreshControlProps>(
  ({ enabled = true, ...rest }, ref) => {
    const { colors } = useTheme<Theme>();
    return IS_IOS && !enabled ? undefined : (
        <RefreshControl
          ref={ref}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressViewOffset={-4} // hide progress view completely
          enabled={enabled}
          {...rest}
        />
      );
  },
);

export default AppRefreshControl;
