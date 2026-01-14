import { Primitive } from 'type-fest';

// https://github.com/Poyoman39/react-key-from-object

type NonNullPrimitive = Exclude<Primitive, null>;

const isPrimitive = (value: unknown): value is NonNullPrimitive =>
  !value || !['object', 'function'].includes(typeof value);
const defaultPrimitiveToKey = (value: NonNullPrimitive): string | undefined => {
  return value === undefined ? undefined : value.toString();
};

export const createKeyGen = ({
  keyBaseName = 'keyGen_',
  primitiveToKey = defaultPrimitiveToKey,
} = {}) => {
  const keysMap = new WeakMap<object, string>();

  const getUniqueKey = (() => {
    let cpt = -1;

    return () => {
      cpt += 1;

      return `${keyBaseName}${cpt}`;
    };
  })();

  return {
    getKey: (value: unknown): string | undefined => {
      if (isPrimitive(value)) {
        return primitiveToKey(value);
      }

      const key = keysMap.get(value as object);
      if (key) {
        return key;
      }

      const newKey = getUniqueKey();
      keysMap.set(value as object, newKey);

      return newKey;
    },
  };
};
