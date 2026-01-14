import { FlashList, FlashListProps, FlashListRef, ListRenderItem } from '@shopify/flash-list';
import React, { MutableRefObject, forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { createKeyGen } from 'src/utils/keyGen';

const NO_ITEM = Symbol('NO_ITEM');
const keyGen = createKeyGen();

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export interface EqualHeightItemsFlashListProps<T> extends FlashListProps<T> {
  animated?: boolean;
}

const EqualHeightItemsFlashList = forwardRef<
  FlashListRef<unknown>,
  EqualHeightItemsFlashListProps<unknown>
>(
  (
    {
      data,
      renderItem,
      keyExtractor,
      numColumns,
      getItemType,
      overrideItemLayout,
      animated,
      ...rest
    },
    ref,
  ) => {
    const unsupportedProp = !!(getItemType || overrideItemLayout);

    const groupedData = useMemo(() => {
      if (unsupportedProp || !data || !numColumns || numColumns <= 1) return data;

      const grouped = [];
      for (let i = 0; i < data.length; i += numColumns) {
        const group = data.slice(i, i + numColumns);
        if (group.length < numColumns) {
          group.push(...Array.from({ length: numColumns - group.length }, () => NO_ITEM));
        }

        grouped.push(group);
      }

      return grouped;
    }, [unsupportedProp, data, numColumns]);

    const renderGroup = useMemo(() => {
      if (unsupportedProp || !renderItem || !numColumns || numColumns <= 1) {
        return renderItem;
      }

      return (info => {
        const { item: items, index: groupIndex, ...restInfo } = info;
        return (
          <View key={groupIndex} style={{ flexDirection: 'row' }}>
            {(items as unknown[]).map((item, itemIndex) => (
              <View
                key={
                  keyExtractor ?
                    keyExtractor(item, groupIndex * numColumns + itemIndex)
                  : keyGen.getKey(item)
                }
                style={{ flex: 1 }}
              >
                {item === NO_ITEM ?
                  undefined
                : renderItem({ ...restInfo, item, index: groupIndex * numColumns + itemIndex })}
              </View>
            ))}
          </View>
        );
      }) satisfies ListRenderItem<unknown>;
    }, [unsupportedProp, numColumns, renderItem, keyExtractor]);

    const groupKeyExtractor = useMemo(() => {
      if (unsupportedProp || !keyExtractor || !numColumns || numColumns <= 1) {
        return keyExtractor;
      }

      return ((items, groupIndex) => {
        return (items as unknown[])
          .map((item, itemIndex) =>
            item === NO_ITEM ?
              `${groupIndex}_${itemIndex}`
            : keyExtractor(item, groupIndex * numColumns + itemIndex),
          )
          .join('-');
      }) satisfies FlashListProps<unknown>['keyExtractor'];
    }, [unsupportedProp, keyExtractor, numColumns]);

    const FlashListComp = animated ? AnimatedFlashList : FlashList;

    return (
      <FlashListComp
        ref={ref}
        data={groupedData}
        renderItem={renderGroup}
        keyExtractor={groupKeyExtractor}
        numColumns={unsupportedProp ? numColumns : undefined}
        getItemType={getItemType}
        overrideItemLayout={overrideItemLayout}
        {...rest}
      />
    );
  },
) as <T>(
  p: EqualHeightItemsFlashListProps<T> & { ref?: MutableRefObject<FlashListRef<T>> },
) => React.ReactElement;

export default EqualHeightItemsFlashList;
