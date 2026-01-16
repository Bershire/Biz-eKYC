type ObjectToCompare<T> = {
  [key in keyof T]: T[key];
};

// Shallow compares two objects of the same type with exceptions and returns a boolean
// Return true if they are equal, false otherwise
export function shallowCompare<T>(
  obj1: ObjectToCompare<T> | null,
  obj2: ObjectToCompare<T> | null,
  exceptions?: (keyof ObjectToCompare<T>)[],
): boolean {
  if (obj1 === null) return obj2 === null;
  if (obj2 === null) return false;

  const keys1 = Object.keys(obj1) as (keyof typeof obj1)[];
  const keys2 = Object.keys(obj2) as (keyof typeof obj2)[];

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (exceptions?.includes(key)) continue;

    if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
      return false;
    }

    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}
