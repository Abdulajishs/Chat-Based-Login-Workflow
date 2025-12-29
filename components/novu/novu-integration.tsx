"use client";

import { NovuProvider } from '@novu/notification-center';
import { useEffect, useState } from 'react';
import { getToken } from "firebase/messaging";
import { messaging } from '@/lib/firebase';
import { registerFcmToken } from '@/app/actions/novu-actions';
import { CustomNotificationBell } from './custom-notification-bell';

import { NOVU_CONFIG, SUBSCRIBER_ID } from '@/utils/constants';


export const NovuIntegration = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const registerServiceWorker = async () => {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                    // console.log('Firebase SW registered with scope:', registration.scope);
                } catch (err) {
                    console.error('Firebase SW registration failed:', err);
                }
            }
        };

        const initFcm = async () => {
            try {
                const msg = await messaging();
                if (!msg) {
                    console.log('Firebase Messaging not supported');
                    return;
                }

                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    const currentToken = await getToken(msg, {
                        vapidKey: NOVU_CONFIG.VAPID_KEY
                    });

                    if (currentToken) {
                        // console.log('FCM Token:', currentToken);
                        // Register this token with Novu backend
                        await registerFcmToken(SUBSCRIBER_ID, currentToken);
                    } else {
                        console.log('No registration token available.');
                    }
                }
            } catch (error) {
                console.error('An error occurred while retrieving token:', error);
            }
        };

        registerServiceWorker();
        initFcm();
    }, []);

    if (!isMounted) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <NovuProvider
                subscriberId={SUBSCRIBER_ID}
                applicationIdentifier={NOVU_CONFIG.APP_ID}
                backendUrl={NOVU_CONFIG.API_URL}
                socketUrl={NOVU_CONFIG.WS_URL}
            >
                <CustomNotificationBell />
            </NovuProvider>
        </div>
    );
}
