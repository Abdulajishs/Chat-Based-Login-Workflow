"use server";

import { NOVU_SERVER_CONFIG, NOVU_CONFIG } from '@/utils/constants';

export async function registerFcmToken(subscriberId: string, token: string) {
    const secretKey = NOVU_SERVER_CONFIG.SECRET_KEY;
    const serverUrl = NOVU_CONFIG.API_URL;

    if (!secretKey) return;

    try {
        const response = await fetch(`${serverUrl}/v1/subscribers/${subscriberId}/credentials`, {
            method: 'PUT',
            headers: {
                'Authorization': `ApiKey ${secretKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                providerId: 'fcm',
                credentials: {
                    deviceTokens: [token]
                }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Failed to set credentials: ${err}`);
        }

        console.log(`FCM token registered for ${subscriberId}`);
        return { success: true };
    } catch (error) {
        console.error("Error registering FCM token", error);
        return { success: false, error: "Failed to register token" };
    }
}
