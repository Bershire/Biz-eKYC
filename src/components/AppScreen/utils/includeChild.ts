import { ComponentType, JSXElementConstructor, ReactElement, ReactPortal } from 'react';

export const includeChild = (
  child: ReactPortal | ReactElement<unknown, string | JSXElementConstructor<unknown>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- most component types use any, so...
  comps: (string | ComponentType<any>)[],
) => {
  return comps.some(comp => {
    return (
        typeof comp === 'string' &&
          (typeof child.type === 'object' || typeof child.type === 'function')
      ) ?
        'name' in child.type && child.type.name === comp
      : comp === child.type;
  });
};
