import * as NavigationBar from 'expo-navigation-bar';
import { delayDebounce } from 'src/utils/useDebounce';

// Inspiration: https://github.com/zoontek/react-native-bars/blob/main/src/NavigationBar.tsx

export type NavigationBarStackProps = {
  barStyle: 'dark' | 'light';
  barColor: string;
};

const propsStack: NavigationBarStackProps[] = [];
let immediate: NodeJS.Immediate | undefined;
let mergedProps: NavigationBarStackProps | undefined;
const debounceUpdateBar = delayDebounce(50);

function createStackEntry({
  barStyle = 'light',
  barColor = '#00000055',
}: NavigationBarStackProps): NavigationBarStackProps {
  return { barStyle, barColor };
}

export function pushStackEntry(props: NavigationBarStackProps): NavigationBarStackProps {
  const entry = createStackEntry(props);
  propsStack.push(entry);
  updatePropsStack();
  return entry;
}

export function popStackEntry(entry: NavigationBarStackProps): void {
  const index = propsStack.indexOf(entry);
  if (index !== -1) {
    propsStack.splice(index, 1);
  }
  updatePropsStack();
}

export function replaceStackEntry(
  entry: NavigationBarStackProps,
  props: NavigationBarStackProps,
): NavigationBarStackProps {
  const newEntry = createStackEntry(props);
  const index = propsStack.indexOf(entry);
  if (index !== -1) {
    propsStack[index] = newEntry;
  }
  updatePropsStack();
  return newEntry;
}

function updatePropsStack() {
  // Send the update to the native module only once at the end of the frame.
  if (immediate) {
    clearImmediate(immediate);
  }

  immediate = setImmediate(() => {
    const oldProps = mergedProps;
    const lastEntry = propsStack.at(-1);

    if (lastEntry) {
      // Update only if style have changed or if current props are unavailable.
      if (oldProps?.barStyle !== lastEntry.barStyle || oldProps.barColor !== lastEntry.barColor) {
        debounceUpdateBar(() => {
          NavigationBar.setBackgroundColorAsync(lastEntry.barColor);
          NavigationBar.setButtonStyleAsync(lastEntry.barStyle);
        });
      }

      // Update the current props values.
      mergedProps = { ...lastEntry };
    } else {
      // Reset current props when the stack is empty.
      mergedProps = undefined;
    }
  });
}
