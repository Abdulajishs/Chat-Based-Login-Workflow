import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

import { FIREBASE_CONFIG } from '@/utils/constants';

const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();

const messaging = async () => {
    const supported = await isSupported();
    return supported ? getMessaging(app) : null;
};

export { app, messaging };
