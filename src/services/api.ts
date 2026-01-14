import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import i18n, { getLanguageLocaleCode } from 'src/i18n/i18n';
import { logout, updateAuthState } from 'src/store/auth';
import { RootState } from 'src/store/store';
import paramsCleaner from 'src/utils/paramsCleaner';
import { z } from 'zod';

const baseQuery = fetchBaseQuery({
  paramsSerializer: paramsCleaner,
  prepareHeaders: (headers, api) => {
    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }
    if (!headers.has('x-locale')) {
      headers.set('x-locale', getLanguageLocaleCode(i18n.language));
    }

    // Do not refresh token with the failed token
    if (headers.has('doRefresh')) {
      headers.delete('doRefresh');
    } else {
      const token = (api.getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
  },
});

const mutex = new Mutex();
const dynamicBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const state = api.getState() as RootState;
  if (!state.apiUrl.url) throw new Error('Missing api url');

  const urlEnd = typeof args === 'string' ? args : args.url;
  const urlEndWithLeadingSlash = urlEnd.startsWith('/') ? urlEnd : `/${urlEnd}`;
  const adjustedUrl =
    z.string().url().safeParse(urlEnd).success ?
      urlEnd
    : `${state.apiUrl.url}${urlEndWithLeadingSlash}`;
  const adjustedArgs = typeof args === 'string' ? adjustedUrl : { ...args, url: adjustedUrl };

  await mutex.waitForUnlock();
  let result = await baseQuery(adjustedArgs, api, extraOptions);

  if (
    result.error &&
    (result.error.status === 401 ||
      (result.error.status === 500 &&
        (result.error.data as { errorMessage?: string } | undefined)?.errorMessage
          ?.toLowerCase()
          .includes('token')))
  ) {
    if (mutex.isLocked()) {
      await mutex.waitForUnlock();
      result = await baseQuery(adjustedArgs, api, extraOptions);
    } else {
      const token = state.auth.token;
      const refreshToken = state.auth.refreshToken;
      if (refreshToken) {
        const release = await mutex.acquire();
        try {
          const refreshResult = await baseQuery(
            {
              url: `${state.apiUrl.url}/auth/refesh-token/`, //yes it's a typo I know
              method: 'POST',
              body: { refresh_token: refreshToken },
              headers: {
                doRefresh: 'true',
              },
            },
            api,
            extraOptions,
          );
          const data = refreshResult.data as any;

          if (data?.access_token) {
            api.dispatch(
              updateAuthState({ token: data.access_token, refreshToken: data.fresh_token }),
            );
            result = await baseQuery(adjustedArgs, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
        } finally {
          release();
        }
      } else if (token) {
        api.dispatch(logout());
      }
    }
  }
  return result;
};

export const api = createApi({
  baseQuery: dynamicBaseQueryWithReauth,
  tagTypes: [
    'profile',
    'notification',
    'shop',
    'address',
    'cart',
    'order',
    'contract',
    'lucky-codes',
    'language',
    'request-list',
    'price',
  ],
  endpoints: () => ({}),
});

export const externalApi = createApi({
  reducerPath: 'externalApi',
  baseQuery: fetchBaseQuery({
    paramsSerializer: paramsCleaner,
  }),
  endpoints: () => ({}),
});
