import { useCallback, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

// Taken from https://github.com/react-native-community/hooks/blob/main/src/useLayout.ts
export function useLayout() {
  const [layout, setLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const onLayout = useCallback((e: LayoutChangeEvent) => setLayout(e.nativeEvent.layout), []);
  const onMeasure = useCallback(
    (x: number, y: number, width: number, height: number) => setLayout({ x, y, width, height }),
    [],
  );
  const onScreenMeasure = useCallback(
    (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) =>
      setLayout({ x: pageX, y: pageY, width, height }),
    [],
  );

  return [
    {
      onLayout,
      onMeasure,
      onScreenMeasure,
    },
    layout,
  ] as const;
}
