import { env } from '@/lib/env';

export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const SUBSCRIBER_ID = "test-user-subscriber-id";

export const NOVU_CONFIG = {
    APP_ID: env.NEXT_PUBLIC_NOVU_APP_ID,
    API_URL: env.NEXT_PUBLIC_NOVU_API_URL,
    WS_URL: env.NEXT_PUBLIC_NOVU_WS_URL,
    VAPID_KEY: env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
};

export const NOVU_SERVER_CONFIG = {
    SECRET_KEY: env.NOVU_SECRET_KEY,
};


export const FIREBASE_CONFIG = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
