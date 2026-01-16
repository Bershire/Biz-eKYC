import { ErrorEvent, TransactionEvent } from 'node_modules/@sentry/core/build/types/types-hoist';
import { store } from 'src/store/store';

export function scrubSentryEvent<T extends ErrorEvent | TransactionEvent>(event: T): T {
  delete event.user?.email;
  delete event.user?.ip_address;
  delete event.extra;

  // Request
  delete event.request?.headers;
  delete event.request?.cookies;
  delete event.request?.data;
  delete event.request?.query_string;
  if (event.request?.url) {
    event.request.url = scrubApiUrl(event.request.url);
  }

  // Exception
  if (event.exception) {
    event.exception.values = event.exception.values?.map(ex => {
      if (ex.mechanism?.data) {
        ex.mechanism.data = Object.fromEntries(
          Object.entries(ex.mechanism.data).map(([key, value]) => [
            key,
            typeof value === 'string' ? scrubString(value) : value,
          ]),
        );
      }

      if (ex.value) {
        ex.value = scrubString(ex.value);
      }

      return ex;
    });
  }

  // Breadcrumbs
  event.breadcrumbs = event.breadcrumbs?.flatMap(breadcrumb => {
    if (breadcrumb.category === 'console') {
      return [];
    }

    if (breadcrumb.message) {
      breadcrumb.message = scrubString(breadcrumb.message);
    }

    if (typeof breadcrumb.data?.url === 'string') {
      breadcrumb.data.url = scrubApiUrl(breadcrumb.data.url);
    }
    return [breadcrumb];
  });

  // Spans
  event.spans = event.spans?.map(span => {
    if (span.description) {
      span.description = scrubString(span.description);
    }

    if (typeof span.data?.url === 'string') {
      span.data.url = scrubApiUrl(span.data.url);
    }

    return span;
  });

  return event;
}

const emailPattern = /[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}/gi;
const urlPattern = /https?:\/\/\S+|www\.\S+/gi;
const numberPattern = /(?<=(?:\b|_)(?:gd)?)\d{7,}(?=\b|_)/gi;
const idPattern = /(?<=\b|_)TCN.+(?=\b|_)/g;
const tokenPattern = /[\w-]{10,}(?:\.[\w-]{10,}){2}/g;
const timestampPattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})/g;

const redacted = '[REDACTED]';
function scrubString(str: string): string {
  
  str = str.replaceAll(urlPattern, scrubApiUrl);
  str = str.replaceAll(emailPattern, redacted);
  str = str.replaceAll(numberPattern, match => '*'.repeat(match.length));
  str = str.replaceAll(idPattern, match => `TCN${'*'.repeat(match.length - 3)}`);
  str = str.replaceAll(timestampPattern, redacted);
  str = str.replaceAll(tokenPattern, redacted);

  for (const field of ['password', 'token', 'code', 'id']) {
    str = str.replaceAll(
      new RegExp(`((?:"|\\\\")[^"]*?${field}(?:"|\\\\")):.+?(?=[,}])`, 'gm'),
      (_, key: string) => {
        const quote = key.startsWith('"') ? '"' : String.raw`\"`;
        return `${key}:${quote}${redacted}${quote}`;
      },
    );
  }
  for (const numberField of ['price', 'fee']) {
    str = str.replaceAll(
      new RegExp(`((?:"|\\\\")[^"]*?${numberField}(?:"|\\\\")):(.+?)(?=[,}])`, 'gm'),
      (match: string, key: string, value: string) => {
        if (Number.isNaN(Number(value))) {
          return match;
        }
        const quote = key.startsWith('"') ? '"' : String.raw`\"`;
        return `${key}:${quote}${redacted}${quote}`;
      },
    );
  }

  return str;
}

function scrubApiUrl(url: string): string {
  let [baseUrl, queryString] = url.split('?');

  // Scrub numeric and TCN-prefixed IDs in path
  baseUrl = baseUrl
    ?.replaceAll(/\/\d+(?=\/|$)/g, '/:id')
    .replaceAll(/\/TCN.+(?=\/|$)/g, '/:tcn_id');

  if (queryString) {
    // Redact all query values
    queryString = queryString
      .split('&')
      .map(param => {
        const [key] = param.split('=');
        return `${key}=:${key}`;
      })
      .join('&');

    return `${baseUrl}?${queryString}`;
  }

  return baseUrl ?? url;
}
