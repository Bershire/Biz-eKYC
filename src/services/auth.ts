import Config from 'react-native-config';
import { BaseResponse } from 'src/@types/api';
import { api } from './api';

export type LoginRequest = {
  email: string;
  password: string;
  os_type: string;
  appsflyer_id?: string;
};
export type LoginWithFirebaseRequest = {
  id_token: string;
  os_type: string;
  appsflyer_id?: string;
};
export type LoginResponse = BaseResponse<{
  access_token: string;
  fresh_token: string;
}>;
export type OtpRequest = {
  id: string;
};
export type RegisterRequest = {
  email: string;
  password: string;
  ref_id: string;
};
export type RegisterResponse = {
  id: string;
  user_id: string;
};
export type RegisterActiveRequest = {
  code: string;
  id: string;
};
export type ForgotPasswordUpdateRequest = {
  code: string;
  id: string;
  password: string;
};
export type ForgotPasswordCheckOtp = {
  success: boolean;
};
export type RegisterActiveResponse = {
  access_token: string;
  fresh_token: string;
};
export type RefreshTokenRequest = {
  refresh_token: string;
};
export type RefreshTokenResponse = {
  access_token: string;
  fresh_token: string;
};
export type MeResponse = {
  id: string;
  username: string;
  phone: string;
  email: string;
  is_active: boolean;
  auth_id: string;
  company_name: string;
  address: string;
  address2: string;
  address3: string;
  post_code: string;
  birthday: string;
  contract_address: string;
  fullname: string;
  gender: string;
  avatar: string;
  auth_type: string;
  point: number;
  level: number;
  pancake_id?: string;
  created_at: string;
  updated_at: string;
  expired_point: Date;
  translation_types: TranslationItem[];
  is_verified: boolean;
};

type TranslationItem = {
  id: number;
  name: string;
  point: string;
  label: string;
};

export type UpdateProfileRequest = {
  address: string;
  address2: string;
  address3: string;
  birthday: string;
  phone: string;
  fullname: string;
  gender: string;
  post_code: string;
};

export type FirebaseRequest = {
  token: string;
};
export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};
export type ForgotPasswordRequest = {
  email: string;
};
export type DecryptAddressPhotoResponse = {
  url: string;
};
export interface DeviceInfo {
  userId: number;
  deviceToken: string;
  deviceOS: string;
  deviceVersion: string;
  deviceAppVersion: string;
}
export type MobileSetting = {
  minAcceptedAndroid: string;
  currentLiveAndroid: string;
  playStoreUrl: string;
  minAcceptedIos: string;
  currentLiveIos: string;
  appStoreUrl: string;
};
export const env = Config.TYPE === 'UAT' ? 'development' : 'production';

export const authApi = api.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (data: LoginRequest) => ({
        url: '/auth/login/',
        method: 'POST',
        body: data,
      }),
    }),
    loginWithFirebase: build.mutation<LoginResponse, LoginWithFirebaseRequest>({
      query: (data: LoginWithFirebaseRequest) => ({
        url: '/auth/firebase/',
        method: 'POST',
        body: data,
      }),
    }),
    otpPrivate: build.mutation<string, OtpRequest>({
      query: (data: OtpRequest) => ({
        url: '/auth/otp-private/',
        method: 'POST',
        body: data,
      }),
    }),
    otpResend: build.mutation<string, OtpRequest>({
      query: (data: OtpRequest) => ({
        url: '/auth/resend-otp/',
        method: 'POST',
        body: data,
      }),
    }),
    registerActive: build.mutation<RegisterActiveResponse, RegisterActiveRequest>({
      query: (data: RegisterActiveRequest) => ({
        url: '/auth/register-active/',
        method: 'POST',
        body: data,
      }),
    }),
    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (data: RegisterRequest) => ({
        url: '/auth/register/',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: build.mutation<RegisterResponse, ForgotPasswordRequest>({
      query: (data: ForgotPasswordRequest) => ({
        url: '/auth/forgot-password/',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPasswordCheckOtp: build.mutation<ForgotPasswordCheckOtp, RegisterActiveRequest>({
      query: (data: RegisterActiveRequest) => ({
        url: '/auth/forgot-password/check-otp/',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPasswordUpdate: build.mutation<void, ForgotPasswordUpdateRequest>({
      query: (data: ForgotPasswordUpdateRequest) => ({
        url: '/auth/forgot-password/update/',
        method: 'POST',
        body: data,
      }),
    }),
    firebase: build.mutation<void, FirebaseRequest>({
      query: (data: FirebaseRequest) => ({
        url: '/me/firebase/',
        method: 'POST',
        body: data,
      }),
    }),
    me: build.query<MeResponse, void>({
      query: () => ({
        url: '/me/',
        method: 'GET',
      }),
      providesTags: ['profile'],
    }),
    updateProfile: build.mutation<void, UpdateProfileRequest>({
      query: (data: UpdateProfileRequest) => ({
        url: '/me/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['profile'],
    }),
    deleteProfile: build.mutation<void, void>({
      query: () => ({
        url: '/me/',
        method: 'DELETE',
      }),
      invalidatesTags: ['profile'],
    }),
    changePassword: build.mutation<void, ChangePasswordRequest>({
      query: (data: ChangePasswordRequest) => ({
        url: '/me/password/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['profile'],
    }),
    changeRef: build.mutation<void, { ref_id: string }>({
      query: data => ({
        url: '/me/ref/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['profile'],
    }),
    changeAvatar: build.mutation<string, { imgFormData: FormData }>({
      query: data => ({
        url: '/me/avatar/',
        method: 'PUT',
        body: data.imgFormData,
        formData: true,
        headers: {
          'content-type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['profile'],
    }),
    uploadAddressPhoto: build.mutation<string, { imgFormData: FormData }>({
      query: data => ({
        url: '/address/uploadImage/',
        method: 'POST',
        body: data.imgFormData,
        formData: true,
        headers: {
          'content-type': 'multipart/form-data',
        },
      }),
    }),
    decryptAddressPhoto: build.query<DecryptAddressPhotoResponse, { id: string }>({
      query: params => ({
        url: `/me/showImage/?id=${params.id}`,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: __DEV__,
});
export const {
  useLoginMutation,
  useLoginWithFirebaseMutation,
  useOtpPrivateMutation,
  useOtpResendMutation,
  useRegisterActiveMutation,
  useForgotPasswordMutation,
  useForgotPasswordCheckOtpMutation,
  useForgotPasswordUpdateMutation,
  useRegisterMutation,
  useMeQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useChangePasswordMutation,
  useChangeAvatarMutation,
  useFirebaseMutation,
  useChangeRefMutation,
  useUploadAddressPhotoMutation,
  useDecryptAddressPhotoQuery,
} = authApi;
