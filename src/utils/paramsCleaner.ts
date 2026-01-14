import { isSafe } from './safety';

/**
 * Remove null and undefined values from the params
 */
export default function paramsCleaner(
  params: Record<string, unknown> | [string, unknown][],
): string {
  const cleanedParams = (Array.isArray(params) ? params : Object.entries(params)).flatMap(
    (entries): [string, string][] => {
      let stringValue: string | undefined;

      if (entries[1] !== null) {
        if (typeof entries[1] === 'object') {
          stringValue = JSON.stringify(entries[1]);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string -- false positive
          stringValue = isSafe(entries[1]) ? `${entries[1]}` : undefined;
        }
      }

      return isSafe(stringValue) ? [[entries[0], stringValue]] : [];
    },
  );

  const esc = encodeURIComponent;
  return cleanedParams.map(([k, v]) => `${esc(k)}=${esc(v)}`).join('&');
}
