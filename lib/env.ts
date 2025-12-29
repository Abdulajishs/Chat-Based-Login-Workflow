import { z } from 'zod';

const serverSchema = z.object({
    NOVU_SECRET_KEY: z.string().min(1, 'NOVU_SECRET_KEY is required'),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const clientSchema = z.object({
    NEXT_PUBLIC_NOVU_APP_ID: z.string().min(1, 'NEXT_PUBLIC_NOVU_APP_ID is required'),
    NEXT_PUBLIC_NOVU_API_URL: z.url({ message: 'NEXT_PUBLIC_NOVU_API_URL must be a valid URL' }),
    NEXT_PUBLIC_NOVU_WS_URL: z.url({ message: 'NEXT_PUBLIC_NOVU_WS_URL must be a valid URL' }),
    NEXT_PUBLIC_FIREBASE_VAPID_KEY: z.string().min(1, 'NEXT_PUBLIC_FIREBASE_VAPID_KEY is required'),
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'NEXT_PUBLIC_FIREBASE_API_KEY is required'),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is required'),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID is required'),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is required'),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is required'),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'NEXT_PUBLIC_FIREBASE_APP_ID is required'),
});

const isServer = typeof window === 'undefined';

const processEnv = {
    NODE_ENV: process.env.NODE_ENV,
    NOVU_SECRET_KEY: process.env.NOVU_SECRET_KEY,
    NEXT_PUBLIC_NOVU_APP_ID: process.env.NEXT_PUBLIC_NOVU_APP_ID,
    NEXT_PUBLIC_NOVU_API_URL: process.env.NEXT_PUBLIC_NOVU_API_URL,
    NEXT_PUBLIC_NOVU_WS_URL: process.env.NEXT_PUBLIC_NOVU_WS_URL,
    NEXT_PUBLIC_FIREBASE_VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let env: z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;

if (isServer) {
    const mergedSchema = serverSchema.extend(clientSchema.shape);
    const parsed = mergedSchema.safeParse(processEnv);

    if (!parsed.success) {
        console.error('Invalid environment variables:\n', z.prettifyError(parsed.error));
        console.debug('Error Details:', JSON.stringify(z.treeifyError(parsed.error), null, 2));
        throw new Error('Invalid environment variables');
    }
    env = parsed.data;
} else {
    const parsed = clientSchema.safeParse(processEnv);

    if (!parsed.success) {
        console.error('Invalid client environment variables:\n', z.prettifyError(parsed.error));
        throw new Error('Invalid environment variables');
    }

    env = parsed.data as any;
}

export { env };
