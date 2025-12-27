export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const NOVU_CONFIG = {
    APP_ID: process.env.NEXT_PUBLIC_NOVU_APP_ID!,
    API_URL: process.env.NEXT_PUBLIC_NOVU_API_URL!,
    WS_URL: process.env.NEXT_PUBLIC_NOVU_WS_URL!,
    VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
};

export const NOVU_SERVER_CONFIG = {
    SECRET_KEY: process.env.NOVU_SECRET_KEY!,
};

export const FIREBASE_CONFIG = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};