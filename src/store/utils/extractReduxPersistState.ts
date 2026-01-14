export const extractReduxPersistState = (state: object): object => {
  return Object.fromEntries(
    Object.entries(state).flatMap(([k, v]) => {
      if (k === '_persist') {
        return [[k, v]];
      }

      if (typeof v === 'object' && v) {
        const extractedObj = extractReduxPersistState(v as object);
        if (Object.keys(extractedObj).length > 0) {
          return [[k, extractedObj]];
        }
      }

      return [];
    }),
  );
};
