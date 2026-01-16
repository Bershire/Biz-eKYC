import Config, { NativeConfig } from 'react-native-config';
import { z } from 'zod';

export function validateEnvConfig() {
  const configSchema: z.ZodType<NativeConfig> = z.object({
    TYPE: z.enum(['UAT', 'PROD']),
    BASE_API_URL: z.string().url(),
    WEB_CLIENT_ID: z.string(),
    IOS_EKYC_APP_ID: z.string(),
    IOS_EKYC_TOKEN: z.string(),
    EKYC_URL: z.string(),
  });

  const res = configSchema.safeParse(Config);
  if (!res.success) {
    throw new Error(
      `Environment variable(s) invalid:\nError: ${res.error}\nEnv: ${JSON.stringify(Config)}`,
    );
  }
}
